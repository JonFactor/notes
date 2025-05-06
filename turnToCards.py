import json, pathlib, time, httpx, ollama, os
from youtube_transcript_api import YouTubeTranscriptApi


OLLAMA_CONNECTION_STR = os.environ.get("OLLAMA_CONNECTION_STR", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("", "deepseek-r1:1.5b")

CARDS_PROMPT_TEMPLATE_PATH = os.environ.get("PROMPT_TEMPLATE_PATH", "promptcard.txt")
QUIZ_PROMPT_TEMPLATE_PATH =  os.environ.get("PROMPT_TEMPLATE_PATH", "promptquiz.txt")

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
            if out.get("question") is None or out.get('question2') is not None or out.get('question') == '':
                raise NameError
            if out.get("answer") is None or out.get('answer2') is not None or out.get('answer') == '':
                raise NameError
            return out
        except:
            counter += 1
            if counter > 4:
                return None

import pymupdf, sys,  base64, io, uuid
def getPages(b644:str, startPage):
    b64 = base64.b64decode(b644.replace("data:application/pdf;base64,", ""))

    pages = []
    filename =  f"./{uuid.uuid1()}.pdf"
    with open(filename, "wb") as f:
        f.write(b64)

    with pymupdf.open(filename)  as f:
        for page in f:
            pages.append(page.get_text())

    os.remove(filename)
    return pages



def StudyGuideGenerate(): #TODO
    pass

def getYtText(link, questionCount=10):
    
    ytt = YouTubeTranscriptApi()
    ytid = link.split("?v=")[1]

    if ytid == None:
        return None

    data = ytt.fetch(ytid)

    points = []

    totalLength = 0
    for i in data:
        totalLength += i.duration

    incriment = totalLength / questionCount
    currentLength = 0

    j = 0
    points.append([])
    for i in data:
        if currentLength >= incriment:
            points.append([])
            currentLength = 0
            j += 1

        points[j].append(i.text)
        
        currentLength += i.duration

    pages = []
    for i in points:
        current = ""
        for ii in i:
            current+= ii + " "
        pages.append(current)

    return pages

def CardGenerate(b64:str, title:str, extraOptions:str="", id=0, isYoutubeLink=False, pageCount=10) :
    

    client = ollama.Client(host=OLLAMA_CONNECTION_STR)
    waitForServer(client, 10)
    downloadModel(client, OLLAMA_MODEL)

    promptTemplate = pathlib.Path(CARDS_PROMPT_TEMPLATE_PATH).read_text()

    pages = None
    if isYoutubeLink:
        pages = getYtText(b64, pageCount)
    else:
        pages = getPages(b64, 1 )
    
	
    responses = []
    for i in pages:
        pageData = executePage(title, i, client, promptTemplate, extraOptions)
        if pageData is not None:
            responses.append(pageData)
        if pages.index(i)/len(pages) > .01:
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



print(CardGenerate("https://www.youtube.com/watch?v=9jnekLeHz3c", "", isYoutubeLink=True, pageCount=40))