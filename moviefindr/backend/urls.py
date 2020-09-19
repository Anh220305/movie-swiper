from django.conf.urls import url
from . import views

urlpatterns = [
    url('api/list', views.get_movie_list, name='get_rest_list'),
    url('', views.index, name='index'),
]
