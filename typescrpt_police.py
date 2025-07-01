# paths = [
#     r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src",
#     r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-lib\src",
#     r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-types\src"
# ]

import os
import re
from collections import defaultdict

# Start your recursing here!
paths = [
    r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src",
    r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-lib\src",
    r"C:\Users\squar\telos\tsapre.desktop\telos\packages\shared-types\src"
]

ignore = ["Props"]  # Types to ignore completely! Props is declared all-over-the-place 
# but that appears to be a conventional usage here at Telos, so I added this ignore array to skip it.

# I 100% used chatgpt for the regexs! Lol. I s-u-c-k at regexes 
type_decl_pattern = re.compile(r'\btype\s+(\w+)\s*=')
interface_decl_pattern = re.compile(r'\binterface\s+(\w+)\b')
usage_pattern = re.compile(r'\b([A-Z][A-Za-z0-9_]*)\b')  # PascalCase only!

declaration_locations = defaultdict(list)
declaration_lines = defaultdict(list)
type_usage_counts = defaultdict(int)
usage_locations = defaultdict(set)

# Dear Future: Ignore comments!
def strip_comments(text: str) -> str:
    text = re.sub(r'//.*', '', text)
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    return text

def extract_script_block(content: str, filepath: str) -> str:
    if not filepath.endswith('.vue'):
        return content
    # mroe regex - ew
    match = re.search(r'<script[^>]*lang=["\']ts["\'][^>]*>([\s\S]*?)</script>', content, re.IGNORECASE)
    return match.group(1) if match else ''

def is_type_imported(type_name: str, content: str) -> bool:
    # still more regexs
    pattern = re.compile(rf'import\s.*\b{type_name}\b.*from\s+[\'"].+[\'"]')
    return bool(pattern.search(content))

def find_declarations(filepath, content):
    stripped = strip_comments(content)
    for match in type_decl_pattern.finditer(stripped):
        typename = match.group(1)
        if typename in ignore:
            continue
        declaration_locations[typename].append(filepath)
        line_num = content[:match.start()].count('\n') + 1
        declaration_lines[typename].append(line_num)

    for match in interface_decl_pattern.finditer(stripped):
        interfacename = match.group(1)
        if interfacename in ignore:
            continue
        declaration_locations[interfacename].append(filepath)
        line_num = content[:match.start()].count('\n') + 1
        declaration_lines[interfacename].append(line_num)

def find_usages(filepath, content):
    stripped = strip_comments(content)
    lines = stripped.splitlines()
    words = usage_pattern.findall(stripped)

    for word in set(words):
        if word in declaration_locations and word not in ignore:
            declared_files = declaration_locations[word]
            declared_lines = declaration_lines[word]

            # Used in same file?
            if filepath in declared_files:
                used_lines = [i + 1 for i, line in enumerate(lines) if word in line]
                non_declared_lines = [ln for ln in used_lines if ln not in declared_lines]
                if non_declared_lines:
                    type_usage_counts[word] += 1
                    usage_locations[word].add(filepath)
            else:
                # Dear Future: script was getting confused with string collisions - so check the imports to prevent false positives
                if is_type_imported(word, stripped):
                    type_usage_counts[word] += 1
                    usage_locations[word].add(filepath)

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        ts_only = extract_script_block(content, filepath)
        find_declarations(filepath, ts_only)
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")

def process_usages():
    for path in paths:
        for root, dirs, files in os.walk(path):
            dirs[:] = [d for d in dirs if d != 'node_modules']
            for file in files:
                if file.endswith('.ts') or file.endswith('.vue'):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()
                        ts_only = extract_script_block(content, filepath)
                        find_usages(filepath, ts_only)
                    except Exception as e:
                        print(f"Error scanning usages in {filepath}: {e}")

def walk_and_collect_declarations():
    for path in paths:
        for root, dirs, files in os.walk(path):
            dirs[:] = [d for d in dirs if d != 'node_modules']
            for file in files:
                if file.endswith('.ts') or file.endswith('.vue'):
                    process_file(os.path.join(root, file))

def show_findings():
    print("+ ------------------------------ Type/Interface Findings -------------+ ")

    for name in sorted(set(list(type_usage_counts.keys()) + list(declaration_locations.keys()))):
        if name in ignore:
            continue

        uses = type_usage_counts.get(name, 0)
        decl_files = declaration_locations.get(name, [])
        decl_lines = declaration_lines.get(name, [])

        if not decl_files:
            continue

        short_paths = []
        for full_path in decl_files:
            short = full_path
            for base in paths:
                short = short.replace(base, "").lstrip("\\/")
            short_paths.append(short)

        print(f"+++++++++++++++++++++++++++++++++++++\nuses {uses} | {name} ")
        for i, sp in enumerate(short_paths):
            line = decl_lines[i] if i < len(decl_lines) else '?'
            print(f"Declared in: {sp} (line {line})")

        if len(decl_files) > 1:
            print("  TSK! TSK!: Shadowing is bad!")

        used_files = usage_locations.get(name, [])
        if used_files:
            for f in sorted(used_files):
                short_file = f
                for base in paths:
                    short_file = short_file.replace(base, "").lstrip("\\/")
                print(f"Used in: {short_file}")

if __name__ == "__main__":
    walk_and_collect_declarations()
    process_usages()
    show_findings()
