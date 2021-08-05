from django.db import models
import datetime;
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import geopandas as gpd
import os
from sqlalchemy import *
from geoalchemy2 import Geometry, WKTElement
from django.contrib.gis.db import models

# Create your models here.
class test_shp(models.Model):
    """  test shp model """

    # fields
    name = models.TextField(primary_key=true)
    hhi = models.TextField(blank=true)
    geom = models.PolygonField(geography=True, srid=4326)

    # Metadata
    class Meta:
        ordering = ['name','hhi']

    def __str__(self):
        return str(self.name) + ":" + str(self.hhi)

class Taoyuan(models.Model):
    fll_ln_field = models.CharField(max_length=80)
    count = models.IntegerField()
    hhi = models.FloatField()
    ownrsh_field = models.FloatField()
    mx_wn_r = models.FloatField()
    mn_wn_r = models.FloatField()
    hhi_typ = models.CharField(max_length=80)
    adj_hhi = models.FloatField()
    land_ar = models.FloatField()
    area_id = models.CharField(max_length=80)
    lnds_cd = models.CharField(max_length=80)
    town_cd = models.CharField(max_length=80)
    geom = models.MultiPolygonField(srid=4326)


