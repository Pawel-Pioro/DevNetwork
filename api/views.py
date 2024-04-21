from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
from django.contrib.auth import login, logout, get_user_model   
from rest_framework_simplejwt.tokens import RefreshToken

import json

from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from django.contrib.auth.models import User
from .models import Profile, Skill

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
            profile = Profile.objects.create(user=user, bio="", experience=request.data['experience'])
            profile.save()
            tokens = RefreshToken.for_user(user)
            return Response({"message": "Created account successfully for " + user.username,
                         "tokens": {"refresh": str(tokens), "access": str(tokens.access_token)}}, status=status.HTTP_201_CREATED)
    return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny,])
def loginView(request):
    data = request.data
    serializer = UserLoginSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.validate(data)
        tokens = RefreshToken.for_user(user)
        #login(request._request, user=user)
        return Response({"message": "Logged in successfully",
                         "tokens": {"refresh": str(tokens), "access": str(tokens.access_token)}}, 
                         status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def logoutView(request):
    logout(request)
    return Response({"Message": "You have been logged out"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def userView(request):
    
    return Response({"username": request.user.username,
                     "email": request.user.email}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny,])
def profile(request, username):
    try:
        user = User.objects.get(username=username)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    profile = Profile.objects.get(user=user)

    return Response({"username": user.username, 
                     "email": user.email, 
                     "bio": profile.bio,
                     "experience": profile.experience,
                     "skills": [skill.name for skill in profile.skills.all()],}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny,])
def getSkills(request):
    res = []
    skills = Skill.objects.all()
    for skill in skills:
        res.append(skill.name)
    return Response({"skills": res}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def updateProfile(request):
    profile = Profile.objects.get(user=request.user)
    profile.bio = request.data['bio']
    profile.experience = request.data['experience']

    profile.skills.clear()
    for skill in request.data['skills']:
        profile.skills.add(Skill.objects.get(name=skill))

    profile.save()
    return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny,])
def searchResults(request):
    users = User.objects.filter(username__icontains=request.GET["q"])
    users_list = []
    for user in users:
        users_list.append(user.username)
    return Response({"results": users_list}, status=status.HTTP_200_OK)