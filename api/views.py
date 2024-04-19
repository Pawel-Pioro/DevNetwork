from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
from django.contrib.auth import login, logout, get_user_model   

import json

from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from django.contrib.auth.models import User

# Create your views here.

@api_view(['GET'])
def index(request):
    return Response("API")


@api_view(['POST'])
@permission_classes([permissions.AllowAny,])
def register(request):
    serialized = UserRegistrationSerializer(data=request.data)

    if serialized.is_valid():
        user = serialized.create(serialized.validated_data)
        if user:
            return Response(serialized.data, status=status.HTTP_201_CREATED)
    return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny,])
def loginView(request):
    data = request.data
    serializer = UserLoginSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.validate(data)
        login(request._request, user=user)
        return Response({"username": user.username,
                         "email": user.email}, 
                         status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def logoutView(request):
    logout(request)
    return Response({"Message": "You have been logged out"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny,])
def userView(request):
    print(request.session)
    #serializer = UserSerializer(request.user)
    #return Response({"user": serializer.data}, status=status.HTTP_200_OK)
    return Response({"is logged in": request.user.is_authenticated}, status=status.HTTP_200_OK)
