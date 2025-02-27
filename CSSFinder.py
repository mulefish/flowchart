import os
import re

def extract_css_selectors(css_content):
    selectors = []
    matches = re.findall(r'([.#]?[a-zA-Z0-9_-]+)\s*\{', css_content)
    for match in matches:
        selectors.append(match)
    return selectors
# https://github.com/Kozea/tinycss2
def process_vue_files(directory):
    css_selectors_count = {}
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')

        for file in files:
            if file.endswith(".vue"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    style_contents = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
                    for style_content in style_contents:
                        selectors = extract_css_selectors(style_content)
                        for selector in selectors:
                            if selector not in css_selectors_count:
                                css_selectors_count[selector] = []
                            if file_path not in css_selectors_count[selector]:
                                css_selectors_count[selector].append(file_path)

    return css_selectors_count

def main():
    #starting_directory = 'C:\\Users\\squar\\telos\\tsapre.desktop\\telos\\apps\\precheck'
    starting_directory = 'C:\\Users\\squar\\telos\\tsapre.desktop\\telos\\apps\\twe\\src'
    css_counts = process_vue_files(starting_directory)
    for selector, files in sorted(css_counts.items(), key=lambda x: len(x[1]), reverse=False):
        if len(files) > 1:
            print(f"{len(files)} occurrences for selector '{selector}' in files:")
            for file in files:
                print(f"  - {file}")
    print(f"Looking for CSS selectors in Vue files starting from {starting_directory}")
    print("CSS Selectors with File References:")
    
if __name__ == "__main__":
    main()
