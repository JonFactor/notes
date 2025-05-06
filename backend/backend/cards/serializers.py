from rest_framework import serializers
from .models import Card, Box, Token

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'question', 'answer', 'boxId', 'rememberCount', 'forgotCount']

class BoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = ['id', 'name', 'user', 'numCompletions']

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model= Token
        fields=['id', 'user', 'count']