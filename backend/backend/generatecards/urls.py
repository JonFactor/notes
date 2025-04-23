from django.urls import path, include
from .views import GenerateView, ProgressView, ExportView

urlpatterns = [
    path("generate/",GenerateView.as_view()),
    path("progress/", ProgressView.as_view()),
    path("export/", ExportView.as_view())
]