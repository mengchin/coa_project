import os
from django.contrib.gis.utils import LayerMapping
from .models import Taoyuan


# Auto-generated `LayerMapping` dictionary for Taoyuan model
taoyuan_mapping = {
    'fll_ln_field': 'fll_ln_',
    'count': 'Count',
    'hhi': 'HHI',
    'ownrsh_field': 'Ownrsh_',
    'mx_wn_r': 'mx_wn_r',
    'mn_wn_r': 'mn_wn_r',
    'hhi_typ': 'HHI_typ',
    'adj_hhi': 'adj_HHI',
    'land_ar': 'land_ar',
    'area_id': 'area_id',
    'lnds_cd': 'lnds_cd',
    'town_cd': 'town_cd',
    'geom': 'MULTIPOLYGON',
}

TaoyuanParcels_shp = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                  'data', 'taoyuan_agri_HHI_84.shp'),
                                     )

def run(verbose=True):
    lm = LayerMapping(Taoyuan, TaoyuanParcels_shp, taoyuan_mapping, transform=False, encoding='utf-8',)
    lm.save(strict=True, verbose= verbose)