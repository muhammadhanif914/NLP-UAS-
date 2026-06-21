import torch
import os

def inspect_model(path):
    print(f"=== Inspecting {path} ===")
    if not os.path.exists(path):
        print("Path does not exist")
        return
    try:
        # Load with weights_only=False or standard torch.load since we want to see the type
        model = torch.load(path, map_location=torch.device('cpu'))
        print("Type:", type(model))
        if isinstance(model, dict):
            print("Keys:", model.keys())
            for k, v in model.items():
                if isinstance(v, torch.Tensor):
                    print(f"  {k}: Tensor of shape {v.shape}")
                else:
                    print(f"  {k}: {type(v)}")
        else:
            print("Model Object Attributes/Methods:")
            print(dir(model)[:20])
            if hasattr(model, 'state_dict'):
                print("State dict keys count:", len(model.state_dict().keys()))
    except Exception as e:
        print("Error loading model:", str(e))

if __name__ == "__main__":
    inspect_model("best_indobert_model.pt")
    inspect_model("best_indobertweet_model.pt")
