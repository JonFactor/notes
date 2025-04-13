from rest_framework import serializers
from .models import Card, Box

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'question', 'answer', 'boxId', 'rememberCount', 'forgotCount']

class BoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = ['id', 'name', 'user', 'numCompletions']