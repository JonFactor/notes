from django.db import models

# Create your models here.

class Card(models.Model):
    question = models.CharField(max_length=500, null=False)
    answer = models.CharField(max_length=500, null=False)
    boxId = models.IntegerField(default=0)
    rememberCount = models.IntegerField(default=0)
    forgotCount = models.IntegerField(default=0)
    
    

class Box(models.Model):
    name = models.CharField(max_length=300, default="NONE")
    user = models.CharField(max_length=2000, default="")
    numCompletions = models.IntegerField(default=0)

