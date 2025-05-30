from django.db import models
from django.conf import settings

class Field(models.Model):
    name = models.CharField(max_length=100)
    location_description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Crop(models.Model):
    name = models.CharField(max_length=100)
    field = models.ForeignKey(Field, on_delete=models.CASCADE)
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ("planted", "Planted"),
        ("growing", "Growing"),
        ("harvested", "Harvested")
    ], default="planted")

    def __str__(self):
        return f"{self.name} in {self.field.name}"

class InputUsed(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name="inputs")
    name = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100)
    date_used = models.DateField()
    
    class Meta:
        verbose_name = "Input Used"
        verbose_name_plural = "Inputs Used"

    def __str__(self):
        return f"{self.name} for {self.crop.name}"
