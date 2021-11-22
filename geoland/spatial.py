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

# ================= Functions for spatial Analysis ================
# Define weights and neighbors
def def_weight(gdf):
    w_knn = KNN.from_dataframe(gdf, k=1)
    w_rook = Rook.from_dataframe(gdf)
    w = attach_islands(w_rook, w_knn)
    return w
# ------- Global ----------
# Moran’s I Global Autocorrelation Statistic
def cal_morans(gdf):
    hhi = gdf['adj_hhi']
    w = def_weight(gdf)
    moran = Moran(hhi, w)
    return moran

# Global G Autocorrelation Statistic
def cal_globalG(gdf):
    hhi = gdf['adj_hhi']
    w = def_weight(gdf)
    globalG = G(hhi, w)
    return globalG

# Global Geary C Autocorrelation statistic
def cal_geary(gdf):
    hhi = gdf['adj_hhi']
    w = def_weight(gdf)
    geary = Geary(hhi, w)
    return geary

# ------- Global ----------
# LISA (Local Moran's I)
def cal_LISA(gdf):
    lisa_gdf = gdf.copy()
    hhi = lisa_gdf['adj_hhi']
    w = def_weight(lisa_gdf)
    lisa = Moran_Local(hhi, w)
    lisa_gdf['hhi_q']= lisa.q
    lisa_gdf['hhi_sig'] = lisa.p_sim
    lisa_gdf.loc[lisa_gdf['hhi_sig'] > 0.05, 'li_type'] = 0
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 1)), 'li_type'] = 1 #HH
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 2)), 'li_type'] = 2 #LH
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 3)), 'li_type'] = 3 #LL
    lisa_gdf.loc[((lisa_gdf.hhi_sig <= 0.05) & (lisa_gdf.hhi_q == 4)), 'li_type'] = 4 #HL
    return lisa_gdf

# Hotspot Analysis (Getis Ord G*)
def cal_G_star(gdf):
    lg_gdf = gdf.copy()
    hhi = gdf['adj_hhi']
    w = def_weight(gdf)
    lg = G_Local(hhi, w,transform='r')
    # Gstar Result (Hotspot Area)
    lg_gdf['hhi_lg_q']= lg.Zs
    lg_gdf['hhi_lg_sig'] = lg.p_sim
    lg_gdf.loc[lg_gdf['hhi_lg_sig'] > 0.1, 'lg_type'] = 0
    lg_gdf.loc[((lg_gdf.hhi_lg_sig <= 0.1) & (lg_gdf.hhi_lg_q > 0)), 'lg_type'] = 1
    lg_gdf.loc[((lg_gdf.hhi_lg_sig <= 0.1) & (lg_gdf.hhi_lg_q < 0)), 'lg_type'] = 2
    return lg_gdf

# Attribute of Hot Spot Area
def cal_hotspots(gdf):
    lg_gdf = cal_G_star(gdf) 
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

    aw_hhi = cluster.groupby('cluster_ID').apply(aw_hhi,'adj_hhi', 'a_weight')
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

    density = cluster.groupby('cluster_ID').apply(dens, 'count', 'land_ar')
    Dense_df = density.copy().reset_index()
    Dense_df.columns =['cluster_ID', 'density']  
    Dense_df['cluster_ID'] = pd.to_numeric(Dense_df['cluster_ID'], errors='coerce')        

    # Merge Gini and area-weighted HHI to clustered areas
    All = pd.merge(pd.merge(pd.merge(Cluster_info,AW_HHI_df,on='cluster_ID'),Dense_df,on='cluster_ID'),parcel_count,on='cluster_ID')
    Final = All.merge(cluster_gdf, on = 'cluster_ID', how = 'left')
    # Change into geojson for map display
    Final_gdf = gpd.GeoDataFrame(Final, geometry='geometry')
    return  Final_gdf