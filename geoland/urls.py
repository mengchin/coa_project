from django.urls import include, path
from geoland.views import taoyuan,Hotspot_map,moran_view,moran_scatter_view,geary_view,Gstar_map, LISA_map,selectCounty

urlpatterns = [
    # render a geojson layer
    path('api/geoland/taoyuan_parcel', taoyuan, name='taoyuan_parcel'),
    path('api/geoland/morans_scatter', moran_scatter_view, name='scatter_view'),
    path('api/geoland/morans', moran_view,name='morans'),
    path('api/geoland/geary', geary_view,name='gearyC'),
    path('api/geoland/Gstar', Gstar_map, name='Gstar'),
    path('api/geoland/LISA', LISA_map, name='LISA'),
    path('api/geoland/hotspots', Hotspot_map, name='hotspots'),
    path('api/geoland/county', selectCounty, name='County'),
]