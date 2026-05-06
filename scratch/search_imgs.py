import urllib.request
import urllib.parse
import json
import re

def search_images(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(
        url, 
        data=None, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    )
    
    try:
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        # Look for the image source in the DuckDuckGo HTML
        urls = re.findall(r'src=\"(//external-content\.duckduckgo\.com/[^\"]+)\"', html)
        return ["https:" + u for u in urls][:10]
    except Exception as e:
        return [str(e)]

print(search_images("odontocompany anuncio instagram"))
