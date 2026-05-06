import urllib.request
import json
import urllib.parse
import re

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
    
    imgs = []
    for res in data.get('results', []):
        img_url = res['image']
        if 'lookaside.instagram' not in img_url and 'fbsbx' not in img_url:
            imgs.append(img_url)
    return imgs[:10]

try:
    print("\n".join(get_images("odontocompany campanha marketing")))
except Exception as e:
    print(e)
