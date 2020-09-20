from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('api/list', views.get_movie_list, name='get_movie_list'),
    path('api/novel_movies/<str:username>/', views.get_novel_movies, name='get_novel_movies'),
    path('api/intersection', views.get_intersection, name='get_intersection'),
    path('api/rate_movie', views.rate_movie, name='rate_movie'),
    path('api/names', views.get_movie_names, name='get_names'),
    path('api/populate', views.populate_new_movies, name='populate_movie_list'),
    path('', views.index, name='index'),
]
