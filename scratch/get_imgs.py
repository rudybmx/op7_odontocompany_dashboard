import urllib.request
import re

url = "https://marcaspelomundo.com.br/anunciantes/odontocompany-anuncia-novos-embaixadores-da-marca/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    imgs = re.findall(r'src=\"([^\"]+(?:jpg|jpeg|png))\"', html)
    for img in imgs:
        if 'odontocompany' in img.lower() or 'embaixadores' in img.lower():
            print(img)
except Exception as e:
    print(e)
