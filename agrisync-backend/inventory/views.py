# inventory/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import InventoryItem
from .serializers import InventoryItemSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows inventory items to be viewed or edited.
    Only accessible by authenticated users.
    """
    queryset = InventoryItem.objects.all().order_by('name')
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can access