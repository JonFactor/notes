from celery import shared_task

from .ai import main

from cards.models import Card, Box
from cards.serializers import BoxSerializer
from django.core.cache import cache
from background_task import background

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

@background_task(schedule=1)
def likeDoStuff(f, name, optionalStr, otherInfo, genid, user, ignoreRewrite, isAnki):
    cache.set(genid, 1)
    print("go hwerewr")

    return False

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
