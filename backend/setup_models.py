import os
import zipfile
import shutil

def zip_dir(dir_path, zip_path):
    print(f"Compressing {dir_path} to {zip_path}...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, os.path.dirname(dir_path))
                zipf.write(file_path, rel_path)
    print("Finished compression.")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Path inside NLP-UAS-
    repo_dir = os.path.dirname(base_dir)
    
    indobert_src = os.path.join(repo_dir, 'best_indobert_model.pt', 'best_indobert_model')
    indobert_dest = os.path.join(models_dir, 'indobert.pt')
    
    indobertweet_src = os.path.join(repo_dir, 'best_indobertweet_model.pt', 'best_indobertweet_model')
    indobertweet_dest = os.path.join(models_dir, 'indobertweet.pt')
    
    if os.path.exists(indobert_src):
        zip_dir(indobert_src, indobert_dest)
    else:
        print(f"Source not found: {indobert_src}")
        
    if os.path.exists(indobertweet_src):
        zip_dir(indobertweet_src, indobertweet_dest)
    else:
        print(f"Source not found: {indobertweet_src}")

if __name__ == "__main__":
    main()
