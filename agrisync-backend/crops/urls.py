from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import FieldViewSet, CropViewSet, InputUsedViewSet

router = DefaultRouter()
router.register(r'fields', FieldViewSet)
router.register(r'crops', CropViewSet)
router.register(r'inputs', InputUsedViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
