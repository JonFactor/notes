

import json, pathlib, time, httpx, ollama, os
from youtube_transcript_api import YouTubeTranscriptApi
from django.core.cache import cache


OLLAMA_CONNECTION_STR = os.environ.get("OLLAMA_CONNECTION_STR", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("", "deepseek-r1:1.5b")

CARDS_PROMPT_TEMPLATE_PATH = os.environ.get("PROMPT_TEMPLATE_PATH", "promptcard.txt")
QUIZ_PROMPT_TEMPLATE_PATH =  os.environ.get("PROMPT_TEMPLATE_PATH", "promptquiz.txt")

import re
alphabets= "([A-Za-z])"
prefixes = "(Mr|St|Mrs|Ms|Dr)[.]"
suffixes = "(Inc|Ltd|Jr|Sr|Co)"
starters = "(Mr|Mrs|Ms|Dr|Prof|Capt|Cpt|Lt|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)"
acronyms = "([A-Z][.][A-Z][.](?:[A-Z][.])?)"
websites = "[.](com|net|org|io|gov|edu|me)"
digits = "([0-9])"
multiple_dots = r'\.{2,}'

def split_into_sentences(text: str) -> list[str]:
    """
    Split the text into sentences.

    If the text contains substrings "<prd>" or "<stop>", they would lead 
    to incorrect splitting because they are used as markers for splitting.

    :param text: text to be split into sentences
    :type text: str

    :return: list of sentences
    :rtype: list[str]
    """
    text = " " + text + "  "
    text = text.replace("\n"," ")
    text = re.sub(prefixes,"\\1<prd>",text)
    text = re.sub(websites,"<prd>\\1",text)
    text = re.sub(digits + "[.]" + digits,"\\1<prd>\\2",text)
    text = re.sub(multiple_dots, lambda match: "<prd>" * len(match.group(0)) + "<stop>", text)
    if "Ph.D" in text: text = text.replace("Ph.D.","Ph<prd>D<prd>")
    text = re.sub("\s" + alphabets + "[.] "," \\1<prd> ",text)
    text = re.sub(acronyms+" "+starters,"\\1<stop> \\2",text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]" + alphabets + "[.]","\\1<prd>\\2<prd>\\3<prd>",text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]","\\1<prd>\\2<prd>",text)
    text = re.sub(" "+suffixes+"[.] "+starters," \\1<stop> \\2",text)
    text = re.sub(" "+suffixes+"[.]"," \\1<prd>",text)
    text = re.sub(" " + alphabets + "[.]"," \\1<prd>",text)
    if "”" in text: text = text.replace(".”","”.")
    if "\"" in text: text = text.replace(".\"","\".")
    if "!" in text: text = text.replace("!\"","\"!")
    if "?" in text: text = text.replace("?\"","\"?")
    text = text.replace(".",".<stop>")
    text = text.replace("?","?<stop>")
    text = text.replace("!","!<stop>")
    text = text.replace("<prd>",".")
    sentences = text.split("<stop>")
    sentences = [s.strip() for s in sentences]
    if sentences and not sentences[-1]: sentences = sentences[:-1]
    return sentences

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

def executePage(title, content, client, promptTemplate, extraOptions, includeNameInAi):
    counter = 0
    while 1:
        
        if includeNameInAi:
            prompt = promptTemplate.replace("$CONTENTS", content).replace("$OPTIONS", extraOptions)
        else:
            prompt = promptTemplate.replace("$CONTENTS", content).replace("$OPTIONS", extraOptions)

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
def getPages(b644:str, startPage, pageCount):
    b64 = base64.b64decode(b644.replace("data:application/pdf;base64,", ""))

    pages = []
    filename =  f"./{uuid.uuid1()}.pdf"
    with open(filename, "wb") as f:
        f.write(b64)

    with pymupdf.open(filename)  as f:
        for page in f:
            pages.append(page.get_text())

    os.remove(filename)

    if pageCount == None:
        return pages
    
    newPages = []
    

    rawTxt = ""
    for i in pages:
        rawTxt+=i + " "

    sentences = split_into_sentences(rawTxt)
    increment = len(sentences) / pageCount

    j = 0
    i = 0

    newPages.append([])
    for sentance in sentences:
        if j >= increment:
                j = 0
                i += 1
                newPages.append([])

        newPages[i].append(sentance)
        j += 1

    newFlattenedPages = []

    for i in newPages:
        flat = ""
        for ii in i:
            flat += ii

        newFlattenedPages.append(flat)
    
    return newFlattenedPages


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


def CardGenerate(b64:str, title:str, extraOptions:str="", id=0, isYoutubeLink=False, pageCount=None, includeNameInAi=False) :
    

    client = ollama.Client(host=OLLAMA_CONNECTION_STR)
    waitForServer(client, 10)
    downloadModel(client, OLLAMA_MODEL)

    promptTemplate = pathlib.Path(CARDS_PROMPT_TEMPLATE_PATH).read_text()

    pages = None
    if isYoutubeLink:
        pages = getYtText(b64, pageCount)
    else:
        pages = getPages(b64, 1, pageCount )
    
	
    responses = []
    cache.set(id, .1)
    for i in pages:
        pageData = executePage(title, i, client, promptTemplate, extraOptions, includeNameInAi)
        if pageData is not None:
            responses.append(pageData)
        if pages.index(i)/len(pages) > .01:
            print(f"page:{pages.index(i)}/{len(pages)}")
            cache.set(id, pages.index(i)/len(pages))

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
    cache.set(id,1)
    print(responses)
    return responses
