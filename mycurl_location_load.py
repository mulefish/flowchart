import requests
import json
import time

url = "https://enrollment-proxy-api.dev.xxxxx-tsa-precheck.com/locations/paged"
params = {
    "include": "schedule"
}
headers = {
    "Accept": "application/json"
}

# Time to fetch the response
response = requests.get(url, headers=headers, params=params)
data = response.json()
results = data.get("results", [])

# Time to find the specific object
search_start = time.perf_counter()

target_id = "733afbcc1ba61950f1cced7bbc4bcbbe"
found = None

for result in results:
    if result.get("id") == target_id:
        found = result
        break

search_end = time.perf_counter()
search_time = search_end - search_start

if found:
    print(f"Found target ID in {search_time:.6f} seconds.")
else:
    print("Target ID not found.")
