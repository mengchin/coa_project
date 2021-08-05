from django.contrib.gis import admin

# Register your models here.
from .models import Taoyuan

admin.site.register(Taoyuan, admin.GeoModelAdmin)