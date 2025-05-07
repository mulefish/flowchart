import os
import shutil
from pathlib import Path
import argparse

# Fixed target directory
TARGET_DIR = Path(r"C:\Users\squar\telos\clone_src\PCKN-1799_legal_names_style_bitrot_v4")
SOURCE_DIR = Path(r"C::\Users\squar\telos\tsapre.desktop\telos\apps\twe\src") 
def copy_selected_files(src_dir, dest_dir, extensions=None):
    if extensions is None:
        extensions = {'.scss', '.ts', '.js', '.css'}

    src_dir = Path(src_dir).resolve()
    dest_dir = dest_dir.resolve()

    if not src_dir.exists():
        raise FileNotFoundError(f"Source directory does not exist: {src_dir}")
    if not dest_dir.exists():
        dest_dir.mkdir(parents=True)

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if Path(file).suffix.lower() in extensions:
                src_file_path = Path(root) / file
                relative_path = src_file_path.relative_to(src_dir)
                dest_file_path = dest_dir / relative_path

                # Ensure the destination directory exists
                dest_file_path.parent.mkdir(parents=True, exist_ok=True)

                shutil.copy2(src_file_path, dest_file_path)
                print(f"Copied: {src_file_path} -> {dest_file_path}")

def main():
    parser = argparse.ArgumentParser(description="Copy .scss, .ts, .js, and .css files while preserving folder structure.")
    copy_selected_files(SOURCE_DIR, TARGET_DIR)

if __name__ == "__main__":
    main()

