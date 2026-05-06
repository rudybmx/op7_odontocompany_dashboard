import os

def replace_in_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        changed = False
        new_content = content
        for old_text, new_text in replacements:
            if old_text in new_content:
                new_content = new_content.replace(old_text, new_text)
                changed = True
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    root_dir = r"d:\QÓZT\PROJETOS IA\APP\op7_odontocompany_dashboard"
    replacements = [
        # Images first
        ("https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo-odontocompany_1618402286.png", "https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7/logo.svg"),
        # Full strings
        ("Odontocompany by Op7", "Op7 Nexo"),
        ("odontocompany-by-op7", "op7-nexo"),
        ("Odontocompany by op7", "Op7 Nexo"),
        # Partial strings
        ("Odontocompany", "Op7 Nexo"),
        ("odontocompany", "op7-nexo"),
    ]
    
    for subdir, dirs, files in os.walk(root_dir):
        if '.git' in subdir or 'node_modules' in subdir or '.next' in subdir:
            continue
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css', '.md', '.html', '.json', '.sql')):
                filepath = os.path.join(subdir, file)
                replace_in_file(filepath, replacements)

if __name__ == "__main__":
    main()
