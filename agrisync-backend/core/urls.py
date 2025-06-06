from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserCreateAPIView, UserListAPIView
from .serializers import MyTokenObtainPairSerializer # IMPORT YOUR CUSTOM SERIALIZER

urlpatterns = [
    # Use the custom serializer for the login view
    path('login/', TokenObtainPairView.as_view(serializer_class=MyTokenObtainPairSerializer), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserCreateAPIView.as_view(), name='user_register'),
    path('users/', UserListAPIView.as_view(), name='user_list'),
]