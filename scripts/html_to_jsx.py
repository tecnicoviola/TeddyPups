import re
import os

def html_to_jsx(html_str):
    # Remove application/ld+json scripts
    s = re.sub(r'<script\b[^>]*type="application/ld\+json"[^>]*>.*?</script>', '', html_str, flags=re.DOTALL)
    # Remove any other scripts
    s = re.sub(r'<script\b[^>]*>.*?</script>', '', s, flags=re.DOTALL)

    # Replace class= with className=
    s = re.sub(r'\bclass="([^"]*)"', r'className="\1"', s)
    
    # SVG & HTML attribute maps
    attr_map = {
        'viewbox=': 'viewBox=',
        'preserveaspectratio=': 'preserveAspectRatio=',
        'pathlength=': 'pathLength=',
        'patternunits=': 'patternUnits=',
        'stroke-width=': 'strokeWidth=',
        'stroke-linecap=': 'strokeLinecap=',
        'stroke-linejoin=': 'strokeLinejoin=',
        'stroke-miterlimit=': 'strokeMiterlimit=',
        'fill-rule=': 'fillRule=',
        'clip-rule=': 'clipRule=',
        'transform-origin=': 'transformOrigin=',
        'transform-box=': 'transformBox=',
        'charset=': 'charSet=',
        'stop-color=': 'stopColor=',
        'stop-opacity=': 'stopOpacity=',
        'focusable=': 'focusable=',
        'tabindex=': 'tabIndex=',
        'autocomplete=': 'autoComplete=',
        'autocorrect=': 'autoCorrect=',
        'autocapitalize=': 'autoCapitalize=',
        'spellcheck=': 'spellCheck=',
        'crossorigin=': 'crossOrigin=',
        'frameborder=': 'frameBorder=',
        'allowfullscreen=': 'allowFullScreen=',
    }
    for old, new in attr_map.items():
        s = re.sub(re.escape(old), new, s, flags=re.IGNORECASE)

    # Remove inert=""
    s = re.sub(r'\binert(?:="[^"]*")?', '', s)

    # Convert style="..." to style={{ ... }}
    def style_repl(match):
        raw_style = match.group(1)
        rules = [r.strip() for r in raw_style.split(';') if r.strip()]
        style_obj_parts = []
        for r in rules:
            if ':' in r:
                k, v = r.split(':', 1)
                k = k.strip()
                v = v.strip().replace('"', '\\"')
                if k.startswith('--'):
                    style_obj_parts.append(f"'{k}': '{v}'")
                else:
                    parts = k.split('-')
                    k_camel = parts[0] + ''.join(x.title() for x in parts[1:])
                    style_obj_parts.append(f"{k_camel}: '{v}'")
        return f"style={{{{ {', '.join(style_obj_parts)} }}}}"

    s = re.sub(r'style="([^"]*)"', style_repl, s)

    # Self-closing void tags in JSX
    for tag in ['img', 'input', 'br', 'hr', 'path', 'circle', 'ellipse', 'rect', 'line', 'polygon', 'polyline', 'stop']:
        s = re.sub(rf'(<{tag}\b[^>]*?)(?<!/)>', r'\1 />', s)

    # Convert internal links <a href="/..." to <Link to="/..."
    def a_repl(match):
        attrs = match.group(1)
        href = match.group(2)
        rest = match.group(3)
        if href.startswith('/') and not href.startswith('//'):
            return f'<Link {attrs}to="{href}"{rest}>'
        return match.group(0)

    s = re.sub(r'<a\b([^>]*?)\bhref="([^"]+)"([^>]*)>', a_repl, s)
    s = s.replace('</a>', '</Link>')

    # Fix HTML comments <!-- ... -->
    s = re.sub(r'<!--.*?-->', '', s, flags=re.DOTALL)

    return s

def main():
    pages = ["puppies", "home", "how-it-works", "happy-families", "gone-home", "faq", "contact"]
    os.makedirs("src/pages", exist_ok=True)
    
    for p in pages:
        in_path = f"reference/mains/{p}.html"
        if not os.path.exists(in_path):
            continue
        with open(in_path, "r", encoding="utf-8") as f:
            html = f.read()

        jsx_body = html_to_jsx(html)

        component_name = {
            "puppies": "PuppiesPage",
            "home": "HomePage",
            "how-it-works": "HowItWorksPage",
            "happy-families": "HappyFamiliesPage",
            "gone-home": "GoneHomePage",
            "faq": "FAQPage",
            "contact": "ContactPage"
        }[p]

        ts_code = f"""import React from 'react';
import {{ Link }} from 'react-router-dom';

export const {component_name}: React.FC = () => {{
  return (
{jsx_body}
  );
}};
"""
        out_path = f"src/pages/{component_name}.tsx"
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(ts_code)
        print(f"Generated {out_path} ({len(ts_code)} bytes)")

if __name__ == "__main__":
    main()
