from celery import shared_task

from .ai import main

from cards.models import Card, Box
from cards.serializers import BoxSerializer
from django.core.cache import cache

@shared_task
def likeDoStuff(f, name, optionalStr, otherInfo, genid, user, ignoreRewrite, isAnki):
    #cache.set(genid, 0)
    print("go hwerewr")

    responses = main(f, name, optionalStr + " " + otherInfo, genid)
        
    if Box.objects.filter(user=user, name=name).count() < 1:
        box = BoxSerializer(data={"user":user, "name":name})
        box.is_valid(raise_exception=True)
        box.save()
    elif ignoreRewrite:
        Card.objects.delete(boxId=Box.objects.filter(user=user, name=name))


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