from rest_framework import generics, permissions
from .serializers import UserCreateSerializer, UserSerializer # Import UserSerializer
from .models import User

class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny] # Allow anyone to register

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all() # Consider filtering for specific roles if needed for dropdowns
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Or IsAdminUser for more restriction
    # You might want to restrict this further, e.g., only admins can see all users,
    # or filter users by role if this list is for assigning tasks to workers.
    # For now, authenticated users can see the list.