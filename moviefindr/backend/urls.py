from django.conf.urls import url
from . import views

urlpatterns = [
    url('api/list', views.get_movie_list, name='get_rest_list'),
    url('api/names', views.get_movie_names, name='get_names'),
    url('api/populate', views.populate_new_movies, name='populate_movie_list'),
    url('', views.index, name='index'),
]
