from django.shortcuts import render
from .ai import main
from rest_framework.views import APIView
from rest_framework.response import Response
from cards.models import Card, Box
from cards.serializers import CardSerializer, BoxSerializer
from .anki import createExportAnki
from django.core.cache import cache
import uuid
from .tasks import likeDoStuff

# Create your views here.





class GenerateView(APIView):
    def post(self, request):
        genid = uuid.uuid4()

        name = request.data.get("name")
        f = request.data.get('file')
        ignoreRewrite = request.data.get('rewriteIgnore')
        user = request.data.get('user', 1)
        isRemeberingPeopleNames = request.data.get('isPeopleNames', True)
        isRemeberingThingNames = request.data.get('isThingNames', True)
        otherInfo = request.data.get('otherInfo', "")
        isAnki = request.data.get("isAnki", False)

        optionalStr = ""
        if isRemeberingPeopleNames and isRemeberingThingNames:
            pass
        elif isRemeberingPeopleNames and not isRemeberingThingNames:
            optionalStr = "dont use names of things like naming for items or concepts just the concepts themselves in any of the questions make sure its just the content thats being tested"
        elif not  isRemeberingPeopleNames and isRemeberingThingNames:
            optionalStr = "dont use peoples names in any of the questions make sure its just the content thats being tested not name remeberance"
        else:
            optionalStr = "dont use names of things like naming for items or concepts just the concepts themselves or peoples names in any of the questions make sure its just the content thats being tested not name remeberance"

        #print(likeDoStuff.delay(f, name, optionalStr, otherInfo, genid, user, ignoreRewrite, isAnki))
        likeDoStuff()
        return Response({'id':genid})

class ProgressView(APIView):
    def get(self, request):
        progid = request.query_params.get('id')
        status = cache.get(progid)
        return Response({'status':status})

class ExportView(APIView):
    def get(self, request):
        user = request.query_params.get('user')
        name = request.query_params.get('name')
        data  = createExportAnki(Box.objects.filter(user=user, name=name).first().id)
        return Response({'anki':data})

    



## make cards and boxes here 