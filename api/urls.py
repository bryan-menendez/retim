from django.urls import path, include
from . import views

urlpatterns = [
    path('room/list', views.RoomListView.as_view()),
    path('room/create', views.RoomCreateView.as_view()),
]
