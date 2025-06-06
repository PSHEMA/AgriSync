# inventory/models.py
from django.db import models

class InventoryItem(models.Model):
    CATEGORY_CHOICES = [
        ('seeds', 'Seeds'),
        ('fertilizer', 'Fertilizer'),
        ('pesticide', 'Pesticide'),
        ('equipment', 'Equipment'),
        ('fuel', 'Fuel'),
        ('other', 'Other'),
    ]

    UNIT_CHOICES = [
        ('kg', 'Kilograms'),
        ('g', 'Grams'),
        ('liters', 'Liters'),
        ('ml', 'Milliliters'),
        ('units', 'Units'),
        ('sacks', 'Sacks'),
    ]

    name = models.CharField(max_length=100, help_text="Name of the inventory item, e.g., 'Urea Fertilizer'")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, help_text="Current quantity in stock")
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='units', help_text="Measurement unit, e.g., kg, liters, units")
    last_updated = models.DateTimeField(auto_now=True, help_text="Timestamp of the last update")

    def __str__(self):
        return f"{self.name} - {self.quantity} {self.get_unit_display()}"

    class Meta:
        ordering = ['name'] # Order items alphabetically by default