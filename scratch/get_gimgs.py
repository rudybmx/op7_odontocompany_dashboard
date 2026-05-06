import urllib.request
import re

url = "https://www.google.com/search?tbm=isch&q=odontocompany+instagram+propaganda"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    imgs = re.findall(r'src=\"(https://encrypted-tbn0\.gstatic\.com/images[^\"]+)\"', html)
    print("\n".join(imgs[:5]))
except Exception as e:
    print(e)
