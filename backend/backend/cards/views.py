from django.shortcuts import render
from .models import Card, Box
from .serializers import CardSerializer, BoxSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.

class BoxView(APIView):
    def get(self, request):
        boxId = request.query_params['id']
        userId = request.query_params['userId']

        # logic for practicing the ones you remebered the least more and such
        box = Box.objects.filter(id=boxId)
        if box is None:
            return Response()
        
        if box.user != userId:
            return Response()
        
        cards = Card.objects.filter(boxId=boxId)
        
        return Response({"name":box.name, "cards":cards, "completions":box.numCompletions})
    
    def patch(self, request):
        boxId = request.data["id"]
        userId = request.data["userId"]
        name = request.data.get("name")
        isNewCompleted = request.data["isNewCompleted"]


        box = Box.objects.filter(id=boxId)
        if box is None:
            return Response()
        
        if box.user != userId:
            return Response()
        
        completions = box.numCompletions
        if isNewCompleted:
            completions += 1
        
        if name is None:
            name = box.name

        box.update(name=name, numCompletions=completions)

        return Response('ok')
    def delete(self, request):
        boxId = request.query_params['id']
        userId = request.query_params['userId']

        box = Box.objects.filter(id=boxId)
        if box is None:
            return Response()
        
        if box.user != userId:
            return Response()
        
        Box.objects.filter(id=boxId).delete()

        return Response('ok')