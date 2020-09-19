from django.conf.urls import url
from . import views

urlpatterns = [
    url('', views.index, name='index'),
    url('api/list', views.get_movie_list, name='get_rest_list'),
]
