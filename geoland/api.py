from shapely.geometry import Point, mapping, shape
from .models import Taoyuan
from django.views.decorators.csrf import csrf_exempt
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse, HttpResponse

@csrf_exempt
def get(request: WSGIRequest):
    if request.method == 'GET':
	    return JsonResponse({'shapes': get_all_test_data()})

# get data from database
def get_all_test_data():
    # all posts
    shapes = []
    for p in Taoyuan.objects.all():
        shape_data = {
            'name': p.fll_ln_field,
            'hhi':p.hhi,
            'hhi_type':p.hhi_typ,
            'land_area':p.land_ar,
            #因為在資料庫儲存是 binary 要轉換成 polygon 字串 (Well-known text representation of geometry)
            'geom': p.geom.wkt
        }
        shapes.append(shape_data)
    return shapes