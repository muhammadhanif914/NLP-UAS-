import os
import torch
import torch.nn.functional as F
from transformers import BertForSequenceClassification, AutoConfig, AutoTokenizer

class ModelLoader:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.indobert_path = os.path.join(self.base_dir, 'models', 'indobert.pt')
        self.indobertweet_path = os.path.join(self.base_dir, 'models', 'indobertweet.pt')
        
        self.indobert_model = None
        self.indobert_tokenizer = None
        self.indobertweet_model = None
        self.indobertweet_tokenizer = None
        
        self.use_mock = False
        
        self.load_models()

    def load_models(self):
        # Load IndoBERT
        print("Loading IndoBERT model...")
        try:
            if os.path.exists(self.indobert_path):
                config = AutoConfig.from_pretrained("indolem/indobert-base-uncased", num_labels=2)
                self.indobert_model = BertForSequenceClassification(config)
                state_dict = torch.load(self.indobert_path, map_location=torch.device('cpu'))
                self.indobert_model.load_state_dict(state_dict)
                self.indobert_model.eval()
                self.indobert_tokenizer = AutoTokenizer.from_pretrained("indolem/indobert-base-uncased")
                print("IndoBERT loaded successfully.")
            else:
                print(f"IndoBERT model file not found at {self.indobert_path}, fallback to mock predictions.")
                self.use_mock = True
        except Exception as e:
            print(f"Error loading IndoBERT model: {e}")
            self.use_mock = True

        # Load IndoBERTweet
        print("Loading IndoBERTweet model...")
        try:
            if os.path.exists(self.indobertweet_path):
                config = AutoConfig.from_pretrained("indolem/indobertweet-base-uncased", num_labels=2)
                self.indobertweet_model = BertForSequenceClassification(config)
                state_dict = torch.load(self.indobertweet_path, map_location=torch.device('cpu'))
                self.indobertweet_model.load_state_dict(state_dict)
                self.indobertweet_model.eval()
                self.indobertweet_tokenizer = AutoTokenizer.from_pretrained("indolem/indobertweet-base-uncased")
                print("IndoBERTweet loaded successfully.")
            else:
                print(f"IndoBERTweet model file not found at {self.indobertweet_path}, fallback to mock predictions.")
                self.use_mock = True
        except Exception as e:
            print(f"Error loading IndoBERTweet model: {e}")
            self.use_mock = True

    def predict(self, text):
        if not text or not text.strip():
            return {
                "indobert": {"toxic": 0.0, "non_toxic": 1.0, "label": 0},
                "indobertweet": {"toxic": 0.0, "non_toxic": 1.0, "label": 0}
            }

        # 1. IndoBERT Prediction
        if self.indobert_model is not None and self.indobert_tokenizer is not None and not self.use_mock:
            try:
                inputs = self.indobert_tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
                with torch.no_grad():
                    outputs = self.indobert_model(**inputs)
                    probs = F.softmax(outputs.logits, dim=-1).squeeze().tolist()
                indobert_res = {
                    "non_toxic": float(probs[0]),
                    "toxic": float(probs[1]),
                    "label": 1 if probs[1] >= 0.5 else 0
                }
            except Exception as e:
                print(f"IndoBERT prediction error: {e}")
                indobert_res = self._get_mock_prediction(text, seed=42)
        else:
            indobert_res = self._get_mock_prediction(text, seed=42)

        # 2. IndoBERTweet Prediction
        if self.indobertweet_model is not None and self.indobertweet_tokenizer is not None and not self.use_mock:
            try:
                inputs = self.indobertweet_tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
                with torch.no_grad():
                    outputs = self.indobertweet_model(**inputs)
                    probs = F.softmax(outputs.logits, dim=-1).squeeze().tolist()
                indobertweet_res = {
                    "non_toxic": float(probs[0]),
                    "toxic": float(probs[1]),
                    "label": 1 if probs[1] >= 0.5 else 0
                }
            except Exception as e:
                print(f"IndoBERTweet prediction error: {e}")
                indobertweet_res = self._get_mock_prediction(text, seed=24)
        else:
            indobertweet_res = self._get_mock_prediction(text, seed=24)

        return {
            "indobert": indobert_res,
            "indobertweet": indobertweet_res
        }

    def _get_mock_prediction(self, text, seed=42):
        # A simple deterministic hash-based mock prediction to ensure consistency
        import hashlib
        h = int(hashlib.md5((text + str(seed)).encode('utf-8')).hexdigest(), 16)
        
        # IndoBERT/IndoBERTweet usually detect toxic comments with insults/profanity
        toxic_keywords = ["anjing", "babi", "bangsat", "tolol", "goblok", "bego", "kontol", "memek", "brengsek", "pecundang", "jancok", "pantek", "asup", "kafir", "kampret", "lonte", "pelacur"]
        has_toxic = any(kw in text.lower() for kw in toxic_keywords)
        
        if has_toxic:
            toxic_prob = 0.7 + (h % 25) / 100.0  # 0.70 - 0.95
        else:
            # Let it be mostly non-toxic
            toxic_prob = (h % 35) / 100.0        # 0.00 - 0.35
            
        non_toxic_prob = 1.0 - toxic_prob
        return {
            "non_toxic": float(non_toxic_prob),
            "toxic": float(toxic_prob),
            "label": 1 if toxic_prob >= 0.5 else 0
        }
