# Generated by Django 3.2.4 on 2021-06-30 04:09

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Taoyuan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fll_ln_field', models.CharField(max_length=80)),
                ('count', models.IntegerField()),
                ('hhi', models.FloatField()),
                ('ownrsh_field', models.FloatField()),
                ('mx_wn_r', models.FloatField()),
                ('mn_wn_r', models.FloatField()),
                ('hhi_typ', models.CharField(max_length=80)),
                ('adj_hhi', models.FloatField()),
                ('land_ar', models.FloatField()),
                ('area_id', models.CharField(max_length=80)),
                ('lnds_cd', models.CharField(max_length=80)),
                ('town_cd', models.CharField(max_length=80)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
    ]
