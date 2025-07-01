import os
from pathlib import Path

# Set up paths
base_dir = Path(__file__).resolve().parent
public_dir = base_dir / 'public'
output_file = base_dir / 'combined_output.txt'

# Explicit list of absolute paths
files_to_include = [
    ##r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src\stores\useLocationStore.ts",
    r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-lib\src\lib\services\BlankObject.service.ts",
    r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-lib\src\lib\composables\useApi.ts",
    #r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src\components\common\LocationPaginator.vue",
    r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-lib\src\lib\types\api.ts"
]

# Write all selected content into the output file
with output_file.open('w', encoding='utf-8') as out:
    # Write explicit files
    for filepath_str in files_to_include:
        file_path = Path(filepath_str)
        if file_path.exists():
            out.write(f"\n\n===== {file_path} =====\n")
            out.write(file_path.read_text(encoding='utf-8'))
        else:
            print(f"File not found: {file_path}")

    for file in sorted(public_dir.glob('*')):
        out.write(f"\n\n===== {file.name} =====\n")
        out.write(file.read_text(encoding='utf-8'))
