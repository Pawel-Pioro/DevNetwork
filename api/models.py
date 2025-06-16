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
    github = models.URLField(blank=True)

    def __str__(self):
        return self.user.username

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    content = models.TextField(max_length=500)
    image = models.ImageField(blank=True, null=True, upload_to="media/")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} to {self.receiver}"
    
class openedDM(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user2")
    last_message = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user1} and {self.user2}"