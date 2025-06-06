from django.db import models
from django.conf import settings

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ("todo", "To Do"),
        ("in_progress", "In Progress"),
        ("done", "Done")
    ], default="todo")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
