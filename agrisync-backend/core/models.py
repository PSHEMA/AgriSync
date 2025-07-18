from django.contrib.auth.models import AbstractUser
from django.db import models
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('worker', 'Farm Worker'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='worker')
    
    def __str__(self):
        return f"{self.username} ({self.role})"