from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    experience = models.TextField(max_length=50, default="Beginner")

    def __str__(self):
        return self.user.username
