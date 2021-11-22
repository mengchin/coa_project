from django.urls import include, path
from geoland.views import (taoyuanAll,Hotspot_map,moran_view, moran_scatter_view,geary_view,Gstar_map,LISA_map,guishanAll,
                           taoyuan_chart,
                           Hotspot_map_taoyuan, moran_view_taoyuan , moran_scatter_view_taoyuan ,geary_view_taoyuan ,Gstar_map_taoyuan ,LISA_map_taoyuan,
                           Hotspot_map_zhongli, moran_view_zhongli , moran_scatter_view_zhongli ,geary_view_zhongli ,Gstar_map_zhongli ,LISA_map_zhongli,
                           Hotspot_map_daxi    ,moran_view_daxi    , moran_scatter_view_daxi    ,geary_view_daxi    ,Gstar_map_daxi    ,LISA_map_daxi,
                           Hotspot_map_yangmei ,moran_view_yangmei , moran_scatter_view_yangmei ,geary_view_yangmei ,Gstar_map_yangmei ,LISA_map_yangmei ,
                           Hotspot_map_luzhu   ,moran_view_luzhu   , moran_scatter_view_luzhu   ,geary_view_luzhu   ,Gstar_map_luzhu   ,LISA_map_luzhu   ,
                           Hotspot_map_dayuan  ,moran_view_dayuan  , moran_scatter_view_dayuan  ,geary_view_dayuan  ,Gstar_map_dayuan  ,LISA_map_dayuan  ,
                           Hotspot_map_guishan ,moran_view_guishan , moran_scatter_view_guishan ,geary_view_guishan ,Gstar_map_guishan ,LISA_map_guishan ,
                           Hotspot_map_bade    ,moran_view_bade    , moran_scatter_view_bade    ,geary_view_bade    ,Gstar_map_bade    ,LISA_map_bade    ,
                           Hotspot_map_longtan ,moran_view_longtan , moran_scatter_view_longtan ,geary_view_longtan ,Gstar_map_longtan ,LISA_map_longtan ,
                           Hotspot_map_pingzheng,moran_view_pingzheng, moran_scatter_view_pingzheng,geary_view_pingzheng,Gstar_map_pingzheng,LISA_map_pingzheng,
                           Hotspot_map_xinwu   ,moran_view_xinwu   , moran_scatter_view_xinwu   ,geary_view_xinwu   ,Gstar_map_xinwu   ,LISA_map_xinwu   ,
                           Hotspot_map_guanyin ,moran_view_guanyin , moran_scatter_view_guanyin ,geary_view_guanyin ,Gstar_map_guanyin ,LISA_map_guanyin ,
                           Hotspot_map_fuxing  ,moran_view_fuxing  , moran_scatter_view_fuxing  ,geary_view_fuxing  ,Gstar_map_fuxing  ,LISA_map_fuxing   
                           )  

urlpatterns = [
    # basic test
    path('api/geoland/taoyuanAll_parcel', taoyuanAll, name='taoyuan_parcelAll'),
    path('api/geoland/morans_scatter', moran_scatter_view, name='scatter_view'),
    path('api/geoland/morans', moran_view,name='morans'),
    path('api/geoland/geary', geary_view,name='gearyC'),
    path('api/geoland/Gstar', Gstar_map, name='Gstar'),
    path('api/geoland/LISA', LISA_map, name='LISA'),
    path('api/geoland/hotspots', Hotspot_map, name='hotspots'),
    path('api/geoland/guishan', guishanAll, name="guishan"),
    path('taoyuan-chart', taoyuan_chart, name='taoyuan-chart'),
    #-----only select one township----
    #taoyuan
    path('api/geoland/morans/taoyuan', moran_view_taoyuan),
    path('api/geoland/geary/taoyuan', geary_view_taoyuan),
    path('api/geoland/Gstar/taoyuan', Gstar_map_taoyuan),
    path('api/geoland/LISA/taoyuan', LISA_map_taoyuan),
    path('api/geoland/hotspots/taoyuan', Hotspot_map_taoyuan),
    #zhongli
    path('api/geoland/morans/zhongli', moran_view_zhongli),
    path('api/geoland/geary/zhongli', geary_view_zhongli),
    path('api/geoland/Gstar/zhongli', Gstar_map_zhongli),
    path('api/geoland/LISA/zhongli', LISA_map_zhongli),
    path('api/geoland/hotspots/zhongli', Hotspot_map_zhongli),
    #daxi
    path('api/geoland/morans/daxi', moran_view_daxi),
    path('api/geoland/geary/daxi', geary_view_daxi),
    path('api/geoland/Gstar/daxi', Gstar_map_daxi),
    path('api/geoland/LISA/daxi', LISA_map_daxi),
    path('api/geoland/hotspots/daxi', Hotspot_map_daxi),
    #yangmei
    path('api/geoland/morans/yangmei', moran_view_yangmei),
    path('api/geoland/geary/yangmei', geary_view_yangmei),
    path('api/geoland/Gstar/yangmei', Gstar_map_yangmei),
    path('api/geoland/LISA/yangmei', LISA_map_yangmei),
    path('api/geoland/hotspots/yangmei', Hotspot_map_yangmei),
    #luzhu
    path('api/geoland/morans/luzhu', moran_view_luzhu),
    path('api/geoland/geary/luzhu', geary_view_luzhu),
    path('api/geoland/Gstar/luzhu', Gstar_map_luzhu),
    path('api/geoland/LISA/luzhu', LISA_map_luzhu),
    path('api/geoland/hotspots/luzhu', Hotspot_map_luzhu),
    #bade
    path('api/geoland/morans/bade', moran_view_bade),
    path('api/geoland/geary/bade', geary_view_bade),
    path('api/geoland/Gstar/bade', Gstar_map_bade),
    path('api/geoland/LISA/bade', LISA_map_bade),
    path('api/geoland/hotspots/bade', Hotspot_map_bade),
    #longtan
    path('api/geoland/morans/longtan', moran_view_longtan),
    path('api/geoland/geary/longtan', geary_view_longtan),
    path('api/geoland/Gstar/longtan', Gstar_map_longtan),
    path('api/geoland/LISA/longtan', LISA_map_longtan),
    path('api/geoland/hotspots/longtan', Hotspot_map_longtan),
    #pingzheng
    path('api/geoland/morans/pingzheng', moran_view_pingzheng),
    path('api/geoland/geary/pingzheng', geary_view_pingzheng),
    path('api/geoland/Gstar/pingzheng', Gstar_map_pingzheng),
    path('api/geoland/LISA/pingzheng', LISA_map_pingzheng),
    path('api/geoland/hotspots/pingzheng', Hotspot_map_pingzheng),
    #xinwu_
    path('api/geoland/morans/xinwu', moran_view_xinwu),
    path('api/geoland/geary/xinwu', geary_view_xinwu),
    path('api/geoland/Gstar/xinwu', Gstar_map_xinwu),
    path('api/geoland/LISA/xinwu', LISA_map_xinwu),
    path('api/geoland/hotspots/xinwu', Hotspot_map_xinwu),
    #guanyin
    path('api/geoland/morans/guanyin', moran_view_guanyin),
    path('api/geoland/geary/guanyin', geary_view_guanyin),
    path('api/geoland/Gstar/guanyin', Gstar_map_guanyin),
    path('api/geoland/LISA/guanyin', LISA_map_guanyin),
    path('api/geoland/hotspots/guanyin', Hotspot_map_guanyin),
    #fuxing
    path('api/geoland/morans/fuxing', moran_view_fuxing),
    path('api/geoland/geary/fuxing', geary_view_fuxing),
    path('api/geoland/Gstar/fuxing', Gstar_map_fuxing),
    path('api/geoland/LISA/fuxing', LISA_map_fuxing),
    path('api/geoland/hotspots/fuxing', Hotspot_map_fuxing),   
]