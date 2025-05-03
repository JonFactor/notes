from celery import shared_task

from .ai import CardGenerate

from cards.models import Card, Box
from cards.serializers import BoxSerializer
from django.core.cache import cache
from background_task import background
import time

@background(queue="ai")
def StudyGuideTask():
    pass

@background(queue="ai")
def QuizGenerateTask():
    pass

@background(queue="ai")
def CardGenerateTask(f, name, optionalStr, otherInfo, genid, user, ignoreRewrite, isAnki):
    cache.set(genid, 0)

    responses = CardGenerate(f, name, optionalStr + " " + otherInfo, genid)
        
    if Box.objects.filter(user=user, name=name).count() < 1:
        if user  is None:
            return 
        elif name is  None:
            name = "UNNAMED"
        box = BoxSerializer(data={"user":user, "name":name})
        box.is_valid(raise_exception=True)
        box.save()
    elif ignoreRewrite:
        Card.objects.filter(boxId=Box.objects.get(user=user, name=name).id).delete()


    box = Box.objects.filter(user=user, name=name).first()

    cardContents = []
    for i in responses:
        if len(str(i.get("question", "")).replace(' ', '')) == 0 or len(str(i.get("answer", "")).replace(' ', '')) == 0:
            continue
        card = Card(
            question= i["question"],
            answer= i["answer"],
            boxId= box.id
        )
        cardContents.append(card)

    Card.objects.bulk_create(cardContents)
