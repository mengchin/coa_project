#----- Login Pages----
from django.contrib import auth
#-----Basic imports for rendering data-----
import os
import requests
from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import get_template
from django.urls import reverse
from django.contrib.gis.geos import GEOSGeometry
from .models import Taoyuan

#-----Libraries for spatial Analysis----
import numpy as np
import pandas as pd
import geopandas as gpd
import libpysal
from geopandas.tools import sjoin
from pysal.lib import weights
from esda.moran import Moran, Moran_Local
from esda.getisord import G, G_Local
from esda.geary import Geary
from splot.esda import moran_scatterplot, plot_moran, lisa_cluster
from libpysal.weights import lat2W,  Rook, KNN, attach_islands


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

#=================== Convert models into Geaojscon API =====================
# Serialize the object and published as an geojson api
def taoyuan(request):
    taoyuan_parcel = serialize('geojson', Taoyuan.objects.all(),
                       geometry_field = 'geom',
                       fields = ('fll_ln_field','adj_hhi', 'land_ar'))
    return HttpResponse(taoyuan_parcel, content_type ='json')

#================================== Spatial Analysis View -================================
#----- Global Variables---------
# Read Shapefile from folder
shp_path = 'geoland/data/zhongli_hhi.shp'
gdf = gpd.read_file(shp_path)
# Define weights and neighbors
def def_weight(gdf):
    w_knn = KNN.from_dataframe(gdf, k=1)
    w_rook = Rook.from_dataframe(gdf)
    w = attach_islands(w_rook, w_knn)
    return w

#-----Functions for spatial Analysis-----
# ------- Global ----------
# Moran’s I Global Autocorrelation Statistic
def cal_morans(gdf):
    hhi = gdf['adj_HHI']
    w = def_weight(gdf)
    moran = Moran(hhi, w)
    return moran

# Global G Autocorrelation Statistic
def cal_globalG(gdf):
    hhi = gdf['adj_HHI']
    w = def_weight(gdf)
    globalG = G(hhi, w)
    return globalG

# Global Geary C Autocorrelation statistic
def cal_geary(gdf):
    hhi = gdf['adj_HHI']
    w = def_weight(gdf)
    geary = Geary(hhi, w)
    return geary

# ------- Global ----------
# LISA (Local Moran's I)
def cal_LISA(gdf):
    hhi = gdf['adj_HHI']
    w = def_weight(gdf)
    moran_local = Moran_Local(hhi, w)
    return moran_local

# Hotspot Analysis (Getis Ord G*)
def cal_G_star(gdf):
    hhi = gdf['adj_HHI']
    w = def_weight(gdf)
    local_g = G_Local(hhi, w, permutations = 9999)
    return local_g

def moran_view(request):
    moran_I = cal_morans(gdf)
    return  HttpResponse(round(moran_I.I,4), content_type="text/plain")

def moran_scatter_view(request, *args, **kwargs):
    moran_I = cal_morans(gdf)
    response = HttpResponse(content_type='image/png')
    fig, ax = plot_moran(moran_I, zstandard=True, figsize=(5,3))
    fig.savefig(response)
    return response

def geary_view(request):
    geary = cal_geary(gdf)
    return  HttpResponse(round(geary.C,4), content_type="text/plain")

@csrf_exempt
def selectCounty(request):
    if request.method == 'GET':
        countyname = request.GET('countyname')
        shp_path = 'geoland/data/'+ countyname+'_hhi.shp'
        gdf = gpd.read_file(shp_path)
        data = gdf.to_json()
    return HttpResponse(data, content_type='json')


#-----Render GeoJSON---------
# LISA Result (HH/LL/HL/LH Area)
def LISA_map(request):
    lisa_gdf = gdf.copy()
    lisa = cal_LISA(lisa_gdf)
    lisa_gdf['hhi_q']= lisa.q
    lisa_gdf['hhi_sig'] = lisa.p_sim
    lisa_gdf.loc[lisa_gdf['hhi_sig'] > 0.05, 'li_type'] = 0
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 1)), 'li_type'] = 1 #HH
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 2)), 'li_type'] = 2 #LH
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 3)), 'li_type'] = 3 #LL
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 4)), 'li_type'] = 4 #HL
    #Change into geojson for map display
    data = lisa_gdf.to_json()
    return HttpResponse(data, content_type='json')

# Gstar Result (Hotspot Area)
lg_gdf = gdf.copy()
lg = cal_G_star(lg_gdf)
lg_gdf['hhi_lg_q']= lg.Zs
lg_gdf['hhi_lg_sig'] = lg.p_sim
lg_gdf.loc[lg_gdf['hhi_lg_sig'] > 0.1, 'lg_type'] = 0
lg_gdf.loc[((lg_gdf.hhi_lg_sig <= 0.1) & (lg_gdf.hhi_lg_q > 0)), 'lg_type'] = 1
lg_gdf.loc[((lg_gdf.hhi_lg_sig <= 0.1) & (lg_gdf.hhi_lg_q < 0)), 'lg_type'] = 2

def Gstar_map(request):
    #Change into geojson for map display
    lg_gdf.to_crs(epsg=3857)
    data = lg_gdf.to_json()
    return HttpResponse(data, content_type='json')

# Attribute of Hot Spot Area
def Hotspot_map(request):
    #lg_gdf = gdf.copy()
    #lg = cal_G_star(lg_gdf)
    #lg_gdf['hhi_lg_q'] = lg.Zs
    #lg_gdf['hhi_lg_sig'] = lg.p_sim
    # Filter significant areas as clustered areas and create a new dataframe
    sig = lg_gdf[(lg_gdf['hhi_lg_sig'] <= 0.1)]
    test = gpd.geoseries.GeoSeries([geom for geom in sig.unary_union.geoms])
    cluster_gdf = gpd.GeoDataFrame(geometry=test)
    cluster_ID = np.arange(0,len(cluster_gdf.index),1)
    cluster_gdf['cluster_ID'] = cluster_ID
    #set crs
    cluster_gdf = cluster_gdf.set_crs('EPSG:4326')
    #------------ Join and count parcels in clustered areas ----------------
    # Spatial Join (將集中區ID空間特徵及屬性特徵 
    from geopandas.tools import sjoin
    join_left_df = sjoin(lg_gdf,cluster_gdf, how="left", op='within')

    # Add constant value column of parcel and count polygons in the clustered area (計算集中區中的農地筆數)
    join_left_df['const']= 1
    parcel_count = join_left_df.groupby('cluster_ID').agg({'const':'sum'}).rename(index=str, columns={"const":"P_in_cl"}).reset_index()
    parcel_count['cluster_ID'] = pd.to_numeric(parcel_count['cluster_ID'], errors='coerce')
    all_cluster_parcels = join_left_df.merge(parcel_count, on = 'cluster_ID')

    # Filter parcel counts over a threshold (篩選集中區內農地有大於5筆的資料)
    cluster = all_cluster_parcels[(all_cluster_parcels['P_in_cl'] >= 5)]

    # Calculate land proportion in each area (計算個別農地在該集中區內所佔的面積比例大小)
    cluster['land_ratio'] = cluster.groupby('cluster_ID', group_keys=False).apply(lambda x: x.land_ar/ x.land_ar.sum())
    #------------Calculate area-weighted HHI, area standard deviation and  ----------------
    # Set a weighted value for calculating area weighted HHI
    cluster['a_weight'] = cluster['land_ar']

    # Calculation of Area-weighted HHI (面積加權平均 HHI)
    def aw_hhi(group, val_name, weight_name):
        d = group[val_name]
        w = group[weight_name]
        try:
            return round((d * w).sum() / w.sum(),3)
        except ZeroDivisionError:
            return d.mean()

    aw_hhi = cluster.groupby('cluster_ID').apply(aw_hhi, 'adj_HHI', 'a_weight')
    AW_HHI_df = aw_hhi.copy().reset_index()
    AW_HHI_df.columns =['cluster_ID', 'aw_hhi']  
    AW_HHI_df['cluster_ID'] = pd.to_numeric(AW_HHI_df['cluster_ID'], errors='coerce')

    # Calculation of other statistics (集中區總面積和集中區面積標準差)
    Cluster_info =  cluster.groupby('cluster_ID').agg({'land_ar':['sum','std']})
    Cluster_info.columns = ['area_sum', 'area_std']
    Cluster_info['area_sum'] = round(Cluster_info['area_sum'] /10000,3)
    Cluster_info['area_std'] = round(Cluster_info['area_std'] /10000,3)

    #Calculation of Density (所有權人密度)
    def dens(group, cnt_name, area_name):
        c = group[cnt_name]
        a = group[area_name]
        try:
            return c.sum() / (a.sum()/10000)
        except ZeroDivisionError:
            return c.mean()

    density = cluster.groupby('cluster_ID').apply(dens, 'Count', 'land_ar')
    Dense_df = density.copy().reset_index()
    Dense_df.columns =['cluster_ID', 'density']  
    Dense_df['cluster_ID'] = pd.to_numeric(Dense_df['cluster_ID'], errors='coerce')        

    # Merge Gini and area-weighted HHI to clustered areas
    All = pd.merge(pd.merge(pd.merge(Cluster_info,AW_HHI_df,on='cluster_ID'),Dense_df,on='cluster_ID'),parcel_count,on='cluster_ID')
    Final = All.merge(cluster_gdf, on = 'cluster_ID', how = 'left')
    #------------Calculate area-weighted HHI, area standard deviation and  ----------------
    # Set a weighted value for calculating area weighted HHI
    cluster['a_weight'] = cluster['land_ar']

    # Calculation of Area-weighted HHI (面積加權平均 HHI)
    def aw_hhi(group, val_name, weight_name):
        d = group[val_name]
        w = group[weight_name]
        try:
            return round((d * w).sum() / w.sum(),3)
        except ZeroDivisionError:
            return d.mean()

    aw_hhi = cluster.groupby('cluster_ID').apply(aw_hhi, 'adj_HHI', 'a_weight')
    AW_HHI_df = aw_hhi.copy().reset_index()
    AW_HHI_df.columns =['cluster_ID', 'aw_hhi']  
    AW_HHI_df['cluster_ID'] = pd.to_numeric(AW_HHI_df['cluster_ID'], errors='coerce')

    # Calculation of other statistics (集中區總面積和集中區面積標準差)
    Cluster_info =  cluster.groupby('cluster_ID').agg({'land_ar':['sum','std']})
    Cluster_info.columns = ['area_sum', 'area_std']
    Cluster_info['area_sum'] = round(Cluster_info['area_sum'] /10000,3)
    Cluster_info['area_std'] = round(Cluster_info['area_std'] /10000,3)

    #Calculation of Density (所有權人密度)
    def dens(group, cnt_name, area_name):
        c = group[cnt_name]
        a = group[area_name]
        try:
            return round(c.sum() / (a.sum()/10000),3)
        except ZeroDivisionError:
            return c.mean()

    density = cluster.groupby('cluster_ID').apply(dens, 'Count', 'land_ar')
    Dense_df = density.copy().reset_index()
    Dense_df.columns =['cluster_ID', 'density']  
    Dense_df['cluster_ID'] = pd.to_numeric(Dense_df['cluster_ID'], errors='coerce')        

    # Merge Gini and area-weighted HHI to clustered areas
    All = pd.merge(pd.merge(pd.merge(Cluster_info,AW_HHI_df,on='cluster_ID'),Dense_df,on='cluster_ID'),parcel_count,on='cluster_ID')
    Final = All.merge(cluster_gdf, on = 'cluster_ID', how = 'left')
    # Change into geojson for map display
    Final_gdf = gpd.GeoDataFrame(Final, geometry='geometry')
    Final_gdf.to_crs(epsg=3857)
    Final_json = Final_gdf.to_json()
    return HttpResponse(Final_json, content_type='json')
