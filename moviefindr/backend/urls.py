from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('api/list', views.get_movie_list, name='get_movie_list'),
    path('api/novel_movies/<str:username>/', views.get_novel_movies, name='get_novel_movies'),
    path('', views.index, name='index'),
]
