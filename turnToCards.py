import json, os

with open("./output.json", "r") as f:
    y = json.loads(f.read())

def flatten_data(y):
    out = []

    for i in y:
        if "questions" in i.keys():
            for ii in i["questions"]:
                out.append(ii)
        else:
            out.append(i)

    return out

print(flatten_data(y))