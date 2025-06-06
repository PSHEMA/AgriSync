from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password # Import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) # Gets the standard claims

        # Add your custom claims
        token['username'] = user.username
        token['role'] = user.role  # This is crucial!
        token['user_id'] = user.id # Also very useful
        # Add any other data you want in the token

        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name'] # Added first_name, last_name

class UserCreateSerializer(serializers.ModelSerializer):
    # Make role optional during registration, default to 'worker'
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='worker', required=False)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True) # Make email required for registration

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user