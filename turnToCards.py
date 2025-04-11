import json, os

with open("./output.json", "r") as f:
    y = json.loads(f.read())

def flatten_data(y):
    out = {}

    def flatten(x, name=''):
        if type(x) is list:
            i = 0
            for a in x:
                flatten(a, name + str(i) + '_')
                i += 1
        else:
            out[name[:-1]] = x

    flatten(y)
    return out

print(flatten_data(y))