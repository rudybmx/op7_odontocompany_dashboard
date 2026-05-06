import urllib.request
import re

url = "https://www.google.com/search?tbm=isch&q=odontocompany+facebook+ads"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    imgs = re.findall(r'src=\"(https://[^"]+)\"', html)
    for img in imgs[:10]:
        if "encrypted" in img or "gstatic" in img:
            print(img)
except Exception as e:
    print(e)
