import json, os

with open("./output.json", "r") as f:
    y = json.loads(f.read())



with open("./formatted.json", "w+") as f:
    json.dump(flatten_data(y), f)