import os
import re
import urllib.parse

PAGES = [
    ("puppies", "PuppiesPage"),
    ("home", "HomePage"),
    ("how-it-works", "HowItWorksPage"),
    ("happy-families", "HappyFamiliesPage"),
    ("gone-home", "GoneHomePage"),
    ("faq", "FAQPage"),
    ("contact", "ContactPage")
]

def clean_images(html_str):
    def repl_src(m):
        url = m.group(1)
        if "/_next/image" in url:
            parsed = urllib.parse.urlparse(url.replace("&amp;", "&"))
            qs = urllib.parse.parse_qs(parsed.query)
            inner = qs.get("url", [""])[0]
            if "logo" in inner:
                return 'src="/brand/logo.png"'
            base = os.path.basename(inner)
            if base:
                return f'src="/images/{base}"'
        return m.group(0)

    # Replace src
    res = re.sub(r'src="([^"]+)"', repl_src, html_str)
    # Remove srcset so browser reliably loads the local image
    res = re.sub(r'\s+srcset="[^"]*"', '', res)
    return res

def build():
    for slug, comp_name in PAGES:
        html_file = f"reference/mains/{slug}.html"
        if not os.path.exists(html_file):
            print(f"Skipping {html_file}")
            continue
        with open(html_file, "r", encoding="utf-8") as f:
            raw_html = f.read()

        processed_html = clean_images(raw_html)
        cleaned_html = processed_html.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

        header = "import React, { useEffect, useRef } from 'react';\nimport { useNavigate } from 'react-router-dom';\n\n"
        ts_code = header + f"""const RAW_HTML = `{cleaned_html}`;

export const {comp_name}: React.FC = () => {{
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {{
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {{
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/cdn-cgi')) {{
        e.preventDefault();
        navigate(href);
      }}
    }};

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }}, [navigate]);

  return (
    <div ref={{containerRef}} dangerouslySetInnerHTML={{{{ __html: RAW_HTML }}}} />
  );
}};
"""
        out_path = f"src/pages/{comp_name}.tsx"
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(ts_code)
        print(f"Wrote {out_path} ({len(ts_code)} bytes)")

if __name__ == "__main__":
    build()
