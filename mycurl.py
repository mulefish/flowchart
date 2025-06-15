import requests
import json

url = (
    "https://enrollment-proxy-api.dev.telos-tsa-precheck.com/"
    "locations/a23af7cc1ba61950f1cced7bbc4bcbaf"
)
params = {"include": "schedule"}
headers = {"Accept": "application/json"}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(f"Status: {response.status_code}")
print(json.dumps(data, indent=2, ensure_ascii=False))
