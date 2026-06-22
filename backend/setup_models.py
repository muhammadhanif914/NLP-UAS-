import os
import shutil

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Path inside NLP-UAS-
    repo_dir = os.path.dirname(base_dir)
    
    indobert_src = os.path.join(repo_dir, 'best_indobert_model.pt')
    indobert_dest = os.path.join(models_dir, 'indobert.pt')
    
    indobertweet_src = os.path.join(repo_dir, 'best_indobertweet_model.pt')
    indobertweet_dest = os.path.join(models_dir, 'indobertweet.pt')
    
    if os.path.exists(indobert_src):
        print(f"Copying {indobert_src} to {indobert_dest}...")
        shutil.copy2(indobert_src, indobert_dest)
        print("IndoBERT copy complete.")
    else:
        print(f"Source not found: {indobert_src}")
        
    if os.path.exists(indobertweet_src):
        print(f"Copying {indobertweet_src} to {indobertweet_dest}...")
        shutil.copy2(indobertweet_src, indobertweet_dest)
        print("IndoBERTweet copy complete.")
    else:
        print(f"Source not found: {indobertweet_src}")

if __name__ == "__main__":
    main()

