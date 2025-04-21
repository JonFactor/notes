import genanki, uuid
from cards.models import Card, Box
from cards.serializers import CardSerializer, BoxSerializer
import os, base64
def createExportAnki(BoxId):
    # get box info
    box = Box.objects.filter(id=BoxId).first()
    if box is None:
        return

    # create anki box
    deck = genanki.Deck(1, box.name)

    # create a card template for anki  box
    model = genanki.Model(
            1, "Simple Model", 
            fields=[{'name': "Question"}, {'name': 'Answer'}], 
            templates=[{'name': box.name, 'qfmt': '{{Question}}', 'afmt':'{{FrontSide}}<hr id="answer">{{Answer}}'}]
        )


    # create a card for each record  for the box
    cards = Card.objects.filter(boxId=box.id)
    print(len(cards))

    for i in cards:
        card = genanki.Note(model=model, fields=[i.question, i.answer])
        deck.add_note(card)

    # export the created box into  a file to be sent to the  user
    name = f"./{uuid.uuid4()}.apkg"
    genanki.Package(deck).write_to_file(name)

    ## convert file to b64
    with open(name, "rb") as f:
        out = f.read()

    encoded = base64.b64encode(out)

    ##  delete file

    os.remove(name)

    ##  return file

    return encoded

