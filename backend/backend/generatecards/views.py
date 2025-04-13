from django.shortcuts import render
from .ai import main
from rest_framework.views import APIView
from rest_framework.response import Response
from cards.models import Card, Box
from cards.serializers import CardSerializer, BoxSerializer

# Create your views here.
class GenerateView(APIView):
    def get(self, request):

        responses = main("/Users/jonfactor/Downloads/no.pdf", "test", "dont use names or peoples names in any of the questions make sure its just the content thats being tested not name remeberance")
        
        if Box.objects.filter(user="1", name="no excuses").count() < 1:
            box = BoxSerializer(data={"user":"1", "name":"no excueses"})
            box.is_valid(raise_exception=True)
            box.save()

        box = Box.objects.filter(user="1", name="no excueses").first()

        cardContents = []
        for i in responses:
            card = Card(
                question= i["question"],
                answer= i["answer"],
                boxId= box.id
            )
            cardContents.append(card)
        
        Card.objects.bulk_create(cardContents)

        return Response('ok')

## make cards and boxes here 