from django.shortcuts import render
from django.http import JsonResponse
from .models import Movie
from .serializers import MovieSerializer
from django.views.decorators.csrf import csrf_exempt
import requests
import json

API_KEY = 'e641ca82ca344df21e96b915c57029c1'


# Create your views here.

def index(request):
    rest_list = Movie.objects.order_by('title')
    context = {'movie_list': rest_list}
    return render(request, 'backend/index.html', context)


# Rest api end point
def get_movie_list(request):
    """
    Returns Json list of all movies
    """
    print("Heyy")
    if request.method == "GET":

        rest_list = Movie.objects.order_by('title')
        serializer = MovieSerializer(rest_list, many=True)
        return JsonResponse(serializer.data, safe=False)


def get_existing_ids():
    return Movie.objects.all().values('movieDbId')


def add_movie_to_db(movie, construct_img_url):
    new = Movie(title=movie['title'], movieDbId=movie['id'], description=movie['overview'], posterUrl=construct_img_url(movie['poster_path']),
                netflixOk=False)
    new.save()


def create_url_construction_fn():
    url = 'https://api.themoviedb.org/3/configuration?api_key=%s' % API_KEY
    r = requests.get(url)
    if r.status_code == 200:
        response = r.json()
        base_url = response["image"]["base_url"]
        img_size = response["image"]["poster_sizes"][3]

        def construct_url(file_path):
            return base_url + img_size + file_path
    else:
        def construct_url(file_path):
            return 'Image Not Found'

    return construct_url


def populate_new_movies(num=50):
    added = 0
    page = 1
    existing = get_existing_ids()
    construct_img_url = create_url_construction_fn()
    while added < num:
        url = 'https://api.themoviedb.org/3/movie/popular?api_key=%s&page=%s' % (API_KEY, page)
        r = requests.get(url)
        if r.status_code == 200:
            popular = r.json()['results']

            def is_new(m):
                return m['id'] not in existing

            for movie in filter(is_new, popular):
                add_movie_to_db(movie, construct_img_url)
                added += 1
            page += 1

    return None
