from django.urls import path, include
from . import views

urlpatterns = [
    path('room/list', views.RoomListView.as_view()),
    path('room/create', views.RoomCreateView.as_view()),
    path('room/get', views.RoomGetView.as_view()),
    path('room/join', views.RoomJoinView.as_view()),
    path('room/user-in-room', views.UserInRoom.as_view()),
    path('room/leave-room', views.UserLeaveRoom.as_view()),
    path('room/room-exists', views.RoomExistsView.as_view()),
    path('room/update', views.RoomUpdateView.as_view()),
]
