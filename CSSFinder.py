import os
import re
import tinycss2
"""
GOAL: 
Find duplicated CSS selectors in a project

NOTE:
This script uses tinycss2
https://github.com/Kozea/tinycss2
pip install tinycss2 
"""

def extract_css_selectors(css_content):
    """THis func is the heart of the script"""
    selectors = []
    rules = tinycss2.parse_stylesheet(css_content, skip_whitespace=True)
    
    for rule in rules:
        if rule.type == 'qualified-rule':
            prelude = tinycss2.serialize(rule.prelude).strip()
            if prelude:
                selectors.append(prelude)
    
    return selectors

def process_vue_files(directory):
    """.vue files and skip node_modules...  ...look in <style """
    css_selectors_count = {}
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')

        for file in files:
            if file.endswith(".vue"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                    # Match all <style> blocks, including scoped or other attrs
                    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)

                    for style_content in style_blocks:
                        selectors = extract_css_selectors(style_content)
                        for selector in selectors:
                            if selector not in css_selectors_count:
                                css_selectors_count[selector] = []
                            if file_path not in css_selectors_count[selector]:
                                css_selectors_count[selector].append(file_path)

    return css_selectors_count

def process_css_files(directory):
    """Look at .css files and avoid recursing into node_modules"""
    css_selectors_count = {}
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')

        for file in files:
            if file.endswith(".css"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    selectors = extract_css_selectors(content)
                    for selector in selectors:
                        if selector not in css_selectors_count:
                            css_selectors_count[selector] = []
                        if file_path not in css_selectors_count[selector]:
                            css_selectors_count[selector].append(file_path)
    
    return css_selectors_count

def main():
    # starting_directory = 'C:\\Users\\squar\\xxxxx\\project.desktop\\xxxxx\\apps\\precheck\\src'
    starting_directory = 'C:\\Users\\squar\\xxxxx\\project.desktop\\xxxxx\\apps\\twe\\src'
    vue_css_counts = process_vue_files(starting_directory)
    css_file_counts = process_css_files(starting_directory)
     
    combined_counts = {**vue_css_counts}
    for selector, files in css_file_counts.items():
        if selector in combined_counts:
            combined_counts[selector].extend(files)
        else:
            combined_counts[selector] = files
    count = 0 
    for selector, files in sorted(combined_counts.items(), key=lambda x: len(x[1]), reverse=False):
        if len(files) > 1:

            count += 1
            print(f"i={count} : count={len(files)} : found '{selector}':")
            for file in files:
                pretty_path = file.replace(starting_directory, "")
                print(f"  - {pretty_path}")
        # else 1 is good! 


    print(f"Looking for CSS selectors in Vue and CSS files starting from {starting_directory}")
    
if __name__ == "__main__":
    main()
