from rest_framework import serializers
from .models import Field, Crop, InputUsed

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'

class InputUsedSerializer(serializers.ModelSerializer):
    class Meta:
        model = InputUsed
        fields = '__all__'

class CropSerializer(serializers.ModelSerializer):
    field = FieldSerializer(read_only=True)
    field_id = serializers.PrimaryKeyRelatedField(
        queryset=Field.objects.all(), source='field', write_only=True
    )
    inputs = InputUsedSerializer(many=True, read_only=True)

    class Meta:
        model = Crop
        fields = ['id', 'name', 'field', 'field_id', 'planting_date', 'expected_harvest_date', 'status', 'inputs']
