from celery import shared_task

from .ai import main

from cards.models import Card, Box
from cards.serializers import BoxSerializer
from django.core.cache import cache
from background_task import background
import time

# @shared_task
# def check_redis_connection():
#         try:
#             cache.set('test_key', 'test_value', timeout=5)
#             value = cache.get('test_key')
#             if value == 'test_value':
#                 return True
#             else:
#                 return False
#         except Exception as e:
#             print(f"Redis connection error: {e}")
#             return False

@background()
def likeDoStuff(f, name, optionalStr, otherInfo, genid, user, ignoreRewrite, isAnki):
    cache.set(genid, 0)

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

    responses = main(f, name, optionalStr + " " + otherInfo, genid)
        



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
