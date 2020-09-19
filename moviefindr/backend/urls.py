from django.conf.urls import url
from . import views

urlpatterns = [
    url('api/list', views.get_movie_list, name='get_movie_list'),
    url('api/novel_movies', views.get_novel_movies, name='get_novel_movies')
    url('', views.index, name='index'),
]
