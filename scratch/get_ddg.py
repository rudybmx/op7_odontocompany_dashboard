import urllib.request
import json
import urllib.parse

def get_images(query):
    # First get the vqd token
    req = urllib.request.Request(
        f"https://duckduckgo.com/?q={urllib.parse.quote(query)}",
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    vqd_match = re.search(r'vqd=([\d-]+)', html)
    
    if not vqd_match:
        return []
        
    vqd = vqd_match.group(1)
    
    # Now get images
    req = urllib.request.Request(
        f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}",
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    data = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    return [res['image'] for res in data.get('results', [])[:10]]

import re
try:
    print("\n".join(get_images("odontocompany propaganda")))
except Exception as e:
    print(e)
