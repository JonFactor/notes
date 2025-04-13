import json, pathlib, time, httpx, ollama, os

OLLAMA_CONNECTION_STR = os.environ.get("OLLAMA_CONNECTION_STR", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("", "deepseek-r1:7b")
PROMPT_TEMPLATE_PATH = os.environ.get("PROMPT_TEMPLATE_PATH", "prompt.txt")

def waitForServer(client: ollama.Client, tries:int):
    while tries > 0:
        try:
            client.ps()
            break
        except:
            print("noServer")
            tries -= 1
            time.sleep(1)
        
def downloadModel(client:ollama.Client, model:str):
    existingModels = [model["model"] for model in client.list()["models"]]
    if model not in existingModels:
        print("downloading")
        client.pull(model)

def executePage(title, content, client, promptTemplate, extraOptions):
    counter = 0
    while 1:
        prompt = promptTemplate.replace("$TITLE", title).replace("$CONTENTS", content).replace("$OPTIONS", extraOptions)
        response = client.generate(model=OLLAMA_MODEL, prompt=prompt, format="json", stream=False)

        try:
            out = json.loads(response.response)
            if out.get("question") is None:
                raise NameError
            return out
        except:
            counter += 1
            if counter > 3:
                return json.loads('{"question":"", "answer":""}')

import pymupdf, sys
def getPages(path:str, startPage):
    with pymupdf.open(path) as doc:
        return [page.get_text() for page in doc][startPage:]

def main(sourcePath:str, title:str, extraOptions:str=""):
    client = ollama.Client(host=OLLAMA_CONNECTION_STR)
    waitForServer(client, 10)
    downloadModel(client, OLLAMA_MODEL)

    promptTemplate = pathlib.Path(PROMPT_TEMPLATE_PATH).read_text()

    pages = getPages(sourcePath, 15 )
    
    responses = []
    for i in pages:
        responses.append(executePage(title, i, client, promptTemplate, extraOptions))
        print(f"page:{pages.index(i)}/{len(pages)}")

    def flatten_data(y):
        out = []

        for i in y:
            if "questions" in i.keys():
                for ii in i["questions"]:
                    out.append(ii)
            else:
                out.append(i)

        return out

    responses = flatten_data(responses)
    
    return responses



