from rest_framework import viewsets
from .models import Field, Crop, InputUsed
from .serializers import FieldSerializer, CropSerializer, InputUsedSerializer
from rest_framework.permissions import IsAuthenticated

class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    permission_classes = [IsAuthenticated]

class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

class InputUsedViewSet(viewsets.ModelViewSet):
    queryset = InputUsed.objects.all()
    serializer_class = InputUsedSerializer
    permission_classes = [IsAuthenticated]
