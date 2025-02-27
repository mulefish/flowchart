import os
import re
from collections import defaultdict

def extract_css_selectors(css_content):
    selectors = defaultdict(int)
    # Match CSS selectors (class, id, and element selectors before the { )
    matches = re.findall(r'([.#]?[a-zA-Z0-9_-]+)\s*\{', css_content)
    for match in matches:
        selectors[match] += 1
    return selectors

def process_vue_files(directory):
    css_selectors_count = defaultdict(int)

    for root, dirs, files in os.walk(directory):
        for file in files:

            if 'node_modules' in dirs:
                dirs.remove('node_modules')

            if file.endswith(".vue"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    style_contents = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
                    for style_content in style_contents:
                        selectors = extract_css_selectors(style_content)
                        for selector, count in selectors.items():
                            css_selectors_count[selector] += count

    return css_selectors_count

def main():
    src_directory = 'C:\\Users\\squar\\telos\\tsapre.desktop\\telos\\apps\\twe\\src'
    css_counts = process_vue_files(src_directory)

    print("CSS Selectors Count:")
    for selector, count in sorted(css_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"{selector}: {count}")

if __name__ == "__main__":
    main()  