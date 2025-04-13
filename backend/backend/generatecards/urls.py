from django.urls import path, include
from .views import GenerateView

urlpatterns = [
    path("generate/",GenerateView.as_view())
]