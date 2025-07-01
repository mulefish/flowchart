r"""
DEAR FUTURE

Ever open a file and see a bunch of css laying around and you are pretty sure there is kruft? Me too. 
This script helps find that kruft. This will accept the path  to a .vue file and look in the <style> section 
to find css selectors and in the <template> section to see what selectors are or are not used. 

Example usage: 
python CSS_in_use_in_given_file.py C:\Users\squar\xxxxx\project.desktop\xxxxx\apps\twe\src\views\Scratchpad.vue
"""

import re
import tinycss2
import sys

def extract_css_selectors(css_content):
    selectors = []
    rules = tinycss2.parse_stylesheet(css_content, skip_whitespace=True)
    
    for rule in rules:
        if rule.type == 'qualified-rule':
            prelude = tinycss2.serialize(rule.prelude).strip()
            if prelude:
                selectors.append(prelude)
    
    return selectors

def extract_used_selectors(template_content):
    class_selectors = re.findall(r'class=["\']([^"\']+)["\']', template_content)
    id_selectors = re.findall(r'id=["\']([^"\']+)["\']', template_content)
    
    used_selectors = set()

    for classes in class_selectors:
        used_selectors.update(f".{cls}" for cls in classes.split())

    for ids in id_selectors:
        used_selectors.add(f"#{ids}")

    return used_selectors

def analyze_vue_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    style_matches = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
    css_selectors = set()
    for style_content in style_matches:
        css_selectors.update(extract_css_selectors(style_content))

    template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    used_selectors = extract_used_selectors(template_match.group(1)) if template_match else set()

    unused_selectors = css_selectors - used_selectors
    used_but_not_defined = used_selectors - css_selectors

    print(f"Analyzing: {file_path}\n")
    print("CSS Selectors Defined in <style>:")
    for selector in sorted(css_selectors):
        print(f"  - {selector}")

    print("\nCSS Selectors Used in <template>:")
    for selector in sorted(used_selectors):
        print(f"  - {selector}")

    print("\nUnused Selectors (Defined but not Used):")
    for selector in sorted(unused_selectors):
        print(f"  - {selector}")

    print("\nUsed but Not Defined (May be from external stylesheets):")
    for selector in sorted(used_but_not_defined):
        print(f"  - {selector}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_vue_file>")
        sys.exit(1)

    vue_file = sys.argv[1]
    analyze_vue_file(vue_file)
