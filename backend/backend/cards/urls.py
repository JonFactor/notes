from django.urls import path, include
from .views import BoxView, BoxListView, CardView

urlpatterns = [
    path("box/",BoxView.as_view()),
    path("boxlist/",BoxListView.as_view()),
    path('card/', CardView.as_view())
]