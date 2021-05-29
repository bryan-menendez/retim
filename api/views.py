from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, RoomCreateSerializer, RoomUpdateSerializer


def index(request):
    pass


class UserLeaveRoom(APIView):
    def post(self, request,format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')

            host_id = self.request.session.session_key
            room_query = Room.objects.filter(host=host_id)

            if len(room_query) > 0:
                room = room_query[0]
                room.delete()

        return Response({'msg': 'left the room'}, status=status.HTTP_200_OK)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'roomCode': self.request.session.get('room_code')
        }

        return JsonResponse(data, status=status.HTTP_200_OK)


class RoomUpdateView(APIView):
    serializer_class = RoomUpdateSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            #TODO, return redirect, user is obviously not an owner

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                room = queryset[0]
                user_id = self.request.session.session_key

                if room.host == user_id:
                    room.guest_can_pause = serializer.data.get('guest_can_pause')
                    room.votes_to_skip = serializer.data.get('votes_to_skip')
                    room.save(update_fields=['guest_can_pause', 'votes_to_skip'])

                    json = RoomSerializer(room).data
                    json["msg"] = "Room updated successfully"
                    return Response(json, status=status.HTTP_202_ACCEPTED)
                else:
                    return Response({'msg': 'Room not owned by the current user'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'msg': 'Malformed request'}, status=status.HTTP_400_BAD_REQUEST)


class RoomExistsView(APIView):
    lookup_url_kwarg = 'roomCode'

    def post(self, request, format=None):
        code = request.data.get(self.lookup_url_kwarg)

        if code is None:
            return Response({'msg': 'no code'}, status=status.HTTP_400_BAD_REQUEST)

        room_query = Room.objects.filter(code=code)

        # room exists
        if len(room_query) > 0:
            return Response(status=status.HTTP_200_OK)
        else:  # room does not exist
            if 'room_code' in self.request.session:
                self.request.session.pop('room_code')

            return Response({'msg': 'room not found'}, status=status.HTTP_404_NOT_FOUND)


class RoomJoinView(APIView):
    lookup_url_kwarg = 'roomCode'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)

        if code is not None:
            room_query = Room.objects.filter(code=code)

            if len(room_query) > 0:
                room = room_query[0]
                self.request.session['room_code'] = code
                return Response({'message': 'joining...'}, status=status.HTTP_200_OK)
            else:
                return Response({'Room not found': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Bad request': 'Null room code'}, status=status.HTTP_400_BAD_REQUEST)


class RoomGetView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'roomCode'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            room_query = Room.objects.filter(code=code)

            if len(room_query) > 0:
                room = RoomSerializer(room_query[0]).data
                room['is_host'] = self.request.session.session_key == room_query[0].host
                return Response(room, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Null room code'}, status=status.HTTP_400_BAD_REQUEST)


class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class RoomCreateView(APIView):
    serializer_class = RoomCreateSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            if queryset.exists():
                room = queryset[0]
                self.request.session['room_code'] = room.code
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                room = Room(host=host, votes_to_skip=votes_to_skip, guest_can_pause=guest_can_pause)
                self.request.session['room_code'] = room.code
                room.save()

            return Response(RoomSerializer(room).data, status.HTTP_201_CREATED)

        return Response(status.HTTP_400_BAD_REQUEST)
