# inventory/admin.py
from django.contrib import admin
from .models import InventoryItem

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'quantity', 'unit', 'last_updated')
    list_filter = ('category', 'unit')
    search_fields = ('name',)