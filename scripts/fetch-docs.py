#!/usr/bin/env python3
"""Fetch Hermes Agent docs and extract article content as text."""
import sys, re, urllib.request

BASE = "https://hermes-agent.nousresearch.com/docs/"

def fetch(path):
    url = BASE + path
    if not url.endswith("/"):
        url += "/"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8")
    except Exception as e:
        return f"ERROR: {e}"

def extract(html):
    m = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
    if not m:
        return "NO ARTICLE"
    t = m.group(1)
    # Remove script/style
    t = re.sub(r'<script[^>]*>.*?</script>', '', t, flags=re.DOTALL)
    t = re.sub(r'<style[^>]*>.*?</style>', '', t, flags=re.DOTALL)
    # Headings
    for lvl in [1,2,3]:
        tag = f'h{lvl}'
        prefix = '#' * lvl
        t = re.sub(
            rf'<{tag}[^>]*>(.*?)</{tag}>',
            lambda m, p=prefix: f'\n{p} ' + re.sub(r'<[^>]+>', '', m.group(1)).split('Direct')[0].strip() + '\n',
            t, flags=re.DOTALL
        )
    # Code blocks
    t = re.sub(r'<pre[^>]*><code[^>]*>(.*?)</code></pre>',
               lambda m: '\n```\n' + re.sub(r'<[^>]+>', '', m.group(1)) + '\n```\n', t, flags=re.DOTALL)
    t = re.sub(r'<code[^>]*>(.*?)</code>',
               lambda m: '`' + re.sub(r'<[^>]+>', '', m.group(1)) + '`', t, flags=re.DOTALL)
    # Lists
    t = re.sub(r'<li[^>]*>', '\n- ', t)
    # Remove remaining tags
    t = re.sub(r'<[^>]+>', '', t)
    # Decode entities
    for k, v in [('&lt;','<'),('&gt;','>'),('&amp;','&'),('&quot;','"'),('&#x27;',"'"),('&#39;',"'")]:
        t = t.replace(k, v)
    t = re.sub(r'\n{3,}', '\n\n', t)
    return t.strip()

if __name__ == "__main__":
    pages = sys.argv[1:] if len(sys.argv) > 1 else [
        "getting-started/updating",
        "getting-started/learning-path",
        "user-guide/cli",
        "user-guide/configuration",
        "user-guide/sessions",
        "user-guide/security",
        "user-guide/features/memory",
        "user-guide/features/skills",
        "user-guide/features/context-files",
        "user-guide/features/personality",
        "user-guide/features/tools",
        "user-guide/features/mcp",
        "user-guide/messaging/",
        "user-guide/messaging/telegram",
        "user-guide/messaging/discord",
        "user-guide/messaging/slack",
        "user-guide/messaging/whatsapp",
        "user-guide/features/cron",
        "user-guide/features/hooks",
        "user-guide/features/delegation",
        "user-guide/features/browser",
        "user-guide/features/code-execution",
        "user-guide/features/vision",
        "user-guide/features/tts",
        "user-guide/features/voice-mode",
        "user-guide/docker",
        "user-guide/profiles",
        "user-guide/features/api-server",
        "reference/cli-commands",
        "reference/environment-variables",
        "reference/faq",
        "reference/skills-catalog",
    ]
    for page in pages:
        print(f"\n{'='*60}")
        print(f"PAGE: {page}")
        print(f"{'='*60}")
        html = fetch(page)
        text = extract(html)
        print(text[:4000])
        print()
