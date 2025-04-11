import json, pathlib, time, httpx, ollama, os

OLLAMA_CONNECTION_STR = os.environ.get("OLLAMA_CONNECTION_STR", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.1:8b")
PROMPT_TEMPLATE_PATH = os.environ.get("PROMPT_TEMPLATE_PATH", "prompt.txt")

def waitForServer(client: ollama.Client, tries:int):
    while tries > 0:
        try:
            client.ps()
            break
        except:
            tries -= 1
            time.sleep(1)
        
def downloadModel(client:ollama.Client, model:str):
    existingModels = [model["model"] for model in client.list()["models"]]
    if model not in existingModels:
        client.pull(model)

def executePage(title, content, client, promptTemplate):
    counter = 0
    while 1:
        prompt = promptTemplate.replace("$TITLE", title).replace("$CONTENTS", content)
        response = client.generate(model=OLLAMA_MODEL, prompt=prompt, format="json", stream=False)

        try:
            out = json.loads(response.response)
            return out
        except:
            counter += 1
            if counter > 3:
                return json.loads('{"question:"", answer:""}')

import pymupdf, sys
def getPages(path:str, startPage):
    with pymupdf.open(path) as doc:
        return [page.get_text() for page in doc][startPage:]

def main():
    client = ollama.Client(host=OLLAMA_CONNECTION_STR)
    waitForServer(client, 10)
    downloadModel(client, OLLAMA_MODEL)

    promptTemplate = pathlib.Path(PROMPT_TEMPLATE_PATH).read_text()

    title = "no excuses"

    pages = getPages(r'C:\Users\jonfa\Downloads\No Excuses (Brian Tracy) (Z-Library).pdf', 15 )
    
    responses = []
    for i in pages:
        responses.append(executePage(title, i, client, promptTemplate))
        print(f"page:{pages.index(i)}/{len(pages)}")

    with open("./output.json", "w+") as f:
        json.dump(responses, f)

main()


