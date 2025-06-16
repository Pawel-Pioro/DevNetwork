from django.contrib.auth import get_user_model, authenticate # type: ignore
from rest_framework import serializers # type: ignore
from .models import Message

import json

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data["email"],
                                        password=validated_data["password"],
                                        username=validated_data["username"])
        user.save()
        user = authenticate(username=validated_data["username"], password=validated_data['password'])
        return user
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, validated_data):
        user = authenticate(username=validated_data["username"], password=validated_data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
    