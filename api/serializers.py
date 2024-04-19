from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

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