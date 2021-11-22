#----- Login Pages----
from django.contrib import auth
#-----Basic imports for rendering data-----
import os
import requests
from django.shortcuts import render
from django.views.generic import TemplateView
from django.template.response import TemplateResponse
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.template.loader import get_template
from django.urls import reverse
from django.contrib.gis.geos import GEOSGeometry
from .models import Taoyuan
from chartjs.views.lines import BaseLineChartView
from django.db.models import Sum

#-----modules for spatial Analysis----
import geopandas as gpd
from .spatial import def_weight,cal_morans, cal_globalG, cal_geary, cal_LISA, cal_G_star, cal_hotspots
from splot.esda import moran_scatterplot, plot_moran, lisa_cluster

#====================== Login Page Renderer ========================
def login(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(index))
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        return HttpResponseRedirect(reverse(index))
    else:
        return render(request, 'login.html', locals())
        
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse(index))

#====================== Main Page Renderer ========================= 
# Create your views here.
@login_required
def index(request):
    return render(request, 'index.html')

#=================== Convert models into Geojscon API =====================
# Serialize the object and published as an geojson api
def taoyuanAll(request):
    all_taoyuan_parcel = serialize('geojson', Taoyuan.objects.all(),
                       geometry_field = 'geom',
                       fields = ('fll_ln_field','adj_hhi', 'land_ar'))
    return HttpResponse(all_taoyuan_parcel, content_type ='json')

def taoyuan_chart(request):
    labels = []
    data = []
    queryset = Taoyuan.objects.values('town_cd').annotate(land_ar=Sum('land_ar')).order_by('-land_ar')
    for entry in queryset:
        labels.append(entry['town_cd'])
        data.append(entry['land_ar'])
        content =  {'labels': labels,
                'data': data,
            }
    return JsonResponse(content)
    


#================================== Spatial Analysis View -================================
#----- Global Variables---------
town_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '02'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
taoyuan_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '01'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
zhongli_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '02'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
daxi_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '03'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
yangmei_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '04'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
luzhu_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '05'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
dayuan_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '06'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
guishan_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '07'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
bade_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '08'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
longtan_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '09'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
pingzheng_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '10'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
xinwu_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '11'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
guanyin_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '12'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))
fuxing_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '13'),
                   geometry_field = 'geom',
                   fields = ('fll_ln_field','count','adj_hhi', 'land_ar', 'town_cd'))

#gdf = gpd.read_file(town_parcel)
taoyuan_gdf = gpd.read_file(taoyuan_parcel)
zhongli_gdf = gpd.read_file(zhongli_parcel)
daxi_gdf = gpd.read_file(daxi_parcel)
yangmei_gdf = gpd.read_file(yangmei_parcel)
luzhu_gdf = gpd.read_file(luzhu_parcel)
dayuan_gdf = gpd.read_file(dayuan_parcel)
guishan_gdf = gpd.read_file(guishan_parcel)
bade_gdf = gpd.read_file(bade_parcel)
longtan_gdf = gpd.read_file(longtan_parcel)
pingzheng_gdf = gpd.read_file(pingzheng_parcel)
xinwu_gdf = gpd.read_file(xinwu_parcel)
guanyin_gdf = gpd.read_file(guanyin_parcel)
fuxing_gdf = gpd.read_file(fuxing_parcel)


#-----Global Spatial Analyis------------
def moran_view(request):
    moran_I = cal_morans(gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view(request):
    geary = cal_geary(gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view(request, *args, **kwargs):
    moran_I = cal_morans(gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

# LISA Result (HH/LL/HL/LH Area)
def LISA_map(request):
    lisa_gdf = cal_LISA(gdf)    
    #Change into geojson for map display
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')


def Gstar_map(request):
    lg_gdf = cal_G_star(gdf) 
    #Change into geojson for map display
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map(request):
    Final_gdf = cal_hotspots(gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#-----------------狂開API 一直開一直開-------------------------
#----桃園-----
def moran_view_taoyuan(request):
    moran_I = cal_morans(taoyuan_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_taoyuan(request):
    geary = cal_geary(taoyuan_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_taoyuan(request, *args, **kwargs):
    moran_I = cal_morans(taoyuan_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_taoyuan(request):
    lisa_gdf = cal_LISA(taoyuan_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_taoyuan(request):
    lg_gdf = cal_G_star(taoyuan_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_taoyuan(request):
    Final_gdf = cal_hotspots(taoyuan_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----中壢-----
def moran_view_zhongli(request):
    moran_I = cal_morans(zhongli_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_zhongli(request):
    geary = cal_geary(zhongli_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_zhongli(request, *args, **kwargs):
    moran_I = cal_morans(zhongli_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_zhongli(request):
    lisa_gdf = cal_LISA(zhongli_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_zhongli(request):
    lg_gdf = cal_G_star(zhongli_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_zhongli(request):
    Final_gdf = cal_hotspots(zhongli_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----大溪-----
def moran_view_daxi(request):
    moran_I = cal_morans(daxi_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_daxi(request):
    geary = cal_geary(daxi_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_daxi(request, *args, **kwargs):
    moran_I = cal_morans(daxi_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_daxi(request):
    lisa_gdf = cal_LISA(daxi_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_daxi(request):
    lg_gdf = cal_G_star(daxi_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_daxi(request):
    Final_gdf = cal_hotspots(daxi_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----楊梅-----
def moran_view_yangmei(request):
    moran_I = cal_morans(yangmei_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_yangmei(request):
    geary = cal_geary(yangmei_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_yangmei(request, *args, **kwargs):
    moran_I = cal_morans(yangmei_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_yangmei(request):
    lisa_gdf = cal_LISA(yangmei_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_yangmei(request):
    lg_gdf = cal_G_star(yangmei_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_yangmei(request):
    Final_gdf = cal_hotspots(yangmei_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----蘆竹-----
def moran_view_luzhu(request):
    moran_I = cal_morans(luzhu_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_luzhu(request):
    geary = cal_geary(luzhu_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_luzhu(request, *args, **kwargs):
    moran_I = cal_morans(luzhu_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_luzhu(request):
    lisa_gdf = cal_LISA(luzhu_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_luzhu(request):
    lg_gdf = cal_G_star(luzhu_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_luzhu(request):
    Final_gdf = cal_hotspots(luzhu_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----大園-----
def moran_view_dayuan(request):
    moran_I = cal_morans(dayuan_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_dayuan(request):
    geary = cal_geary(dayuan_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_dayuan(request, *args, **kwargs):
    moran_I = cal_morans(dayuan_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_dayuan(request):
    lisa_gdf = cal_LISA(dayuan_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_dayuan(request):
    lg_gdf = cal_G_star(dayuan_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_dayuan(request):
    Final_gdf = cal_hotspots(dayuan_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----龜山-----
def moran_view_guishan(request):
    moran_I = cal_morans(guishan_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_guishan(request):
    geary = cal_geary(guishan_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_guishan(request, *args, **kwargs):
    moran_I = cal_morans(guishan_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_guishan(request):
    lisa_gdf = cal_LISA(guishan_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_guishan(request):
    lg_gdf = cal_G_star(guishan_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_guishan(request):
    Final_gdf = cal_hotspots(guishan_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----八德-----
def moran_view_bade(request):
    moran_I = cal_morans(bade_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_bade(request):
    geary = cal_geary(bade_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_bade(request, *args, **kwargs):
    moran_I = cal_morans(bade_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_bade(request):
    lisa_gdf = cal_LISA(bade_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_bade(request):
    lg_gdf = cal_G_star(bade_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_bade(request):
    Final_gdf = cal_hotspots(bade_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----龍潭-----
def moran_view_longtan(request):
    moran_I = cal_morans(longtan_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_longtan(request):
    geary = cal_geary(longtan_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_longtan(request, *args, **kwargs):
    moran_I = cal_morans(longtan_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_longtan(request):
    lisa_gdf = cal_LISA(longtan_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_longtan(request):
    lg_gdf = cal_G_star(longtan_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_longtan(request):
    Final_gdf = cal_hotspots(longtan_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----平鎮-----
def moran_view_pingzheng(request):
    moran_I = cal_morans(pingzheng_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_pingzheng(request):
    geary = cal_geary(pingzheng_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_pingzheng(request, *args, **kwargs):
    moran_I = cal_morans(pingzheng_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_pingzheng(request):
    lisa_gdf = cal_LISA(pingzheng_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_pingzheng(request):
    lg_gdf = cal_G_star(pingzheng_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_pingzheng(request):
    Final_gdf = cal_hotspots(pingzheng_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----新屋-----
def moran_view_xinwu(request):
    moran_I = cal_morans(xinwu_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_xinwu(request):
    geary = cal_geary(xinwu_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_xinwu(request, *args, **kwargs):
    moran_I = cal_morans(xinwu_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_xinwu(request):
    lisa_gdf = cal_LISA(xinwu_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_xinwu(request):
    lg_gdf = cal_G_star(xinwu_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_xinwu(request):
    Final_gdf = cal_hotspots(xinwu_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----觀音-----
def moran_view_guanyin(request):
    moran_I = cal_morans(guanyin_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_guanyin(request):
    geary = cal_geary(guanyin_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_guanyin(request, *args, **kwargs):
    moran_I = cal_morans(guanyin_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_guanyin(request):
    lisa_gdf = cal_LISA(guanyin_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_guanyin(request):
    lg_gdf = cal_G_star(guanyin_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_guanyin(request):
    Final_gdf = cal_hotspots(guanyin_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')

#----復興-----
def moran_view_fuxing(request):
    moran_I = cal_morans(fuxing_gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def geary_view_fuxing(request):
    geary = cal_geary(fuxing_gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

def moran_scatter_view_fuxing(request, *args, **kwargs):
    moran_I = cal_morans(fuxing_gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def LISA_map_fuxing(request):
    lisa_gdf = cal_LISA(fuxing_gdf)    
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Gstar_map_fuxing(request):
    lg_gdf = cal_G_star(fuxing_gdf) 
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

def Hotspot_map_fuxing(request):
    Final_gdf = cal_hotspots(fuxing_gdf)
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')


#Test of Guishan 
# Serialize the object and published as an geojson api
def guishanAll(request):
    all_taoyuan_parcel = serialize('geojson', Taoyuan.objects.filter(town_cd = '07'),
                       geometry_field = 'geom',
                       fields = ('fll_ln_field','adj_hhi', 'land_ar'))
    return HttpResponse(all_taoyuan_parcel, content_type ='json')
