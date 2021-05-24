from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index),
    path('room/join', views.index),
    path('room/create', views.index),
]
