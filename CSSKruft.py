import re
import tinycss2
import sys
import os

CSS_GLOBAL_FILE = r"C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src\main.css"

def extract_css_selectors(css_content):
    selectors = set()
    rules = tinycss2.parse_stylesheet(css_content, skip_whitespace=True)
    
    for rule in rules:
        if rule.type == 'qualified-rule':
            prelude = tinycss2.serialize(rule.prelude).strip()
            if prelude:
                selectors.add(prelude)
    
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

def read_global_css():
    if os.path.exists(CSS_GLOBAL_FILE):
        with open(CSS_GLOBAL_FILE, 'r', encoding='utf-8') as f:
            return extract_css_selectors(f.read())
    return set()

def analyze_vue_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    global_css_selectors = read_global_css()
    
    style_matches = re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)
    component_css_selectors = set()
    for style_content in style_matches:
        component_css_selectors.update(extract_css_selectors(style_content))
    
    all_defined_selectors = global_css_selectors.union(component_css_selectors)
    
    template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    used_selectors = extract_used_selectors(template_match.group(1)) if template_match else set()
    
    missing_selectors = used_selectors - all_defined_selectors
    
    print(f"Analyzing: {file_path}\n")
    print("CSS Selectors Used in <template> but Not Defined Anywhere:")
    for selector in sorted(missing_selectors):
        print(f"  - {selector}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python CSSKruft.py <path_to_vue_file>")
        print(r"Usage: python CSSKrufty.py C:\Users\squar\telos\tsapre.desktop\telos\apps\twe\src\views\WebAttributes.vue")
        sys.exit(1)

    vue_file = sys.argv[1]
    analyze_vue_file(vue_file)

    