from django.shortcuts import render
from .models import Card, Box
from .serializers import CardSerializer, BoxSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.

class BoxListView(APIView):
    def get(self, request):

        boxes = Box.objects.filter(user = request.query_params['user'])

        ids = []
        for i in boxes:
            ids.append(i.id)

        data = { "ids": ids}

        return Response(data=data)

class BoxSpecificsView(APIView):
    def get(self,  request):
        boxId = request.query_params['id']
        userId = request.query_params['userId']

        box  =  Box.objects.filter(id=boxId, user=userId).first()
        if  box  is  None:
            return Response()
        
        # get r  to f
        cards  = Card.objects.filter(boxId=boxId)

        Rcount = 0
        Fcount = 0
        for card  in cards:
            Rcount += card.forgotCount
            Fcount += card.rememberCount

        rtof  =  0
        if Rcount == 0 and  Fcount == 0:
            rtof = 0
        elif Rcount ==  0:
            rtof = 0
        elif Fcount ==  0:
            rtof = 100
        else:
            rtof = Rcount / Fcount
        
        data = {"name":box.name, "Completions": box.numCompletions, "RtoF":rtof}



        return Response(data=data)


class BoxView(APIView):
    def get(self, request):
        boxId = request.query_params['id']
        userId = request.query_params['userId']

        # logic for practicing the ones you remebered the least more and such
        box = Box.objects.filter(id=boxId).first()
        if box is None:
            return Response()
        
        if box.user != userId:
            return Response()
        
        cards = Card.objects.filter(boxId=boxId)
        serializer = CardSerializer(data=cards, many=True)
        serializer.is_valid()

        return Response({"name":box.name, "cards":serializer.data, "completions":box.numCompletions, "id":box.id})
    
    def patch(self, request):
        boxId = request.data["id"]
        userId = request.data["userId"]
        name = request.data.get("name")
        isNewCompleted = request.data["isNewCompleted"]
        responses = request.data.get("responses", {"responses":[], "ids":[]})


        box = Box.objects.filter(id=boxId).first()
        if box is None:
            return Response()
        
        if box.user != userId:
            return Response()
        
        completions = box.numCompletions
        if isNewCompleted:
            completions += 1
        
        if name is None:
            name = box.name

        if len(responses["responses"]) > 0:
            j = 0
            for i in responses["ids"]:
                card = Card.objects.filter(id=i).first()
                if Card is None:
                    continue
                if responses["responses"][j]:
                    Card.objects.filter(id=i).update(rememberCount=card.rememberCount+1)
                else:
                    Card.objects.filter(id=i).update(forgotCount=card.forgotCount+1)
                j+=1

        Box.objects.filter(id=boxId).update(name=name, numCompletions=completions)

        return Response('ok')
    def delete(self, request):
        boxId = request.query_params['id']
        userId = request.query_params['userId']

        box = Box.objects.filter(id=boxId).first()
        if box is None:
            return Response()
        
        if box.user != userId:
            return Response()
        
        Box.objects.filter(id=boxId).first().delete()

        return Response('ok')

class CardView(APIView):
    # def patch(self, request):
    #     '  update the correct or incorrect '

    #     cardId = request.data.get('cardId')
    #     user = request.data.get('user')
    #     isForgetten = request.data.get('isForgotten', False)
    #     isRemebered = request.data.get('isRemebered', False)

        
    #     card = Card.objects.filter(id=cardId).first()

    #     if card is None:
    #         return Response()
        
    #     if Box.objects.filter(id=card.boxId).first().user != user:
    #         return Response()
        
    #     Card.objects.update(id=cardId, isForgetten=isForgetten, isRemebered=isRemebered)

    #     return Response('ok')
    
    def delete(self, request):

        cardId = request.query_params['id']
        userId = request.query_params['userId']
        
        card = Card.objects.filter(id=cardId).first()

        if card is None:
            return Response()
        
        if Box.objects.filter(id=card.boxId).first().user != userId:
            return Response()
        
        Card.objects.filter(id=cardId).first().delete()

        if len(Card.objects.filter(boxId=card.boxId)) == 0:
            Box.objects.filter(id=card.boxId).first().delete()

        return Response('ok')