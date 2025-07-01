import os
import shutil
from pathlib import Path
# Working in a mono-repo can be a pain. This script is to help avleaviate some of that pain. 
# This will copy a filetree from location X to location Y - thus allowing graceful cross-branch comparisoning. 
# 
# Save you current TELOS repo from SOURCE_DIR into TARGET_DIR. 
# TARGET_DIR is outside of the project and I will name my targets whatever their 
# github repo branch name is. 

TARGET_DIR = Path(r"C:\Users\squar\xxxxx\clone_src\location_v6_mondays_2")
# SOURCE_DIR = Path(r"C:\Users\squar\xxxxx\project.desktop\xxxxx\apps\twe")
SOURCE_DIR = Path(r"C:\Users\squar\xxxxx\project.desktop\xxxxx")

EXCLUDED_DIRS = {'__tests__', 'node_modules'}

def copy_selected_files(src_dir, dest_dir, extensions=None):
    if extensions is None:
        extensions = {'.scss', '.ts', '.js', '.css', '.vue'}

    src_dir = Path(src_dir).resolve()
    dest_dir = Path(dest_dir).resolve()

    if not src_dir.exists():
        raise FileNotFoundError(f"Source directory does not exist: {src_dir}")
    if not dest_dir.exists():
        dest_dir.mkdir(parents=True)

    for root, dirs, files in os.walk(src_dir):
        # Exclude specified directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

        current_dir = Path(root)
        relative_dir = current_dir.relative_to(src_dir)
        target_dir = dest_dir / relative_dir
        target_dir.mkdir(parents=True, exist_ok=True)

        for file in files:
            if Path(file).suffix.lower() in extensions:
                src_file_path = current_dir / file
                dest_file_path = target_dir / file
                shutil.copy2(src_file_path, dest_file_path)
                # print(f"Copied: {src_file_path} -> {dest_file_path}")

def main():
    copy_selected_files(SOURCE_DIR, TARGET_DIR)
    print(f"TO {TARGET_DIR}")
    print(f"FrOM {SOURCE_DIR}")

if __name__ == "__main__":
    main()
