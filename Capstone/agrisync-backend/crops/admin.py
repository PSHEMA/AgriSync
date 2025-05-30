from django.contrib import admin
from .models import Crop, Field, InputUsed

admin.site.register(Crop)
admin.site.register(Field)
admin.site.register(InputUsed)
