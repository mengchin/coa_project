"""coa_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from geoland.views import index, login, logout
from geoland.models import test_shp 
from geoland.api import get
from django.contrib.auth import views as auth_views


api_path = 'api/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",index,name='index'),
    path("", include('geoland.urls')),
    path(api_path+"geoland/test_shp",get),
    # render login page
    path('accounts/login/', login, name='login'),
    path('accounts/logout/', logout, name='logout'),
]

