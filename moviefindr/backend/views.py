from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Movie, User
from .serializers import MovieSerializer
from django.views.decorators.csrf import csrf_exempt
import requests
import json

API_KEY = 'e641ca82ca344df21e96b915c57029c1'


# Create your views here.

def index(request):
    movie_list = Movie.objects.order_by('title')
    context = {'movie_list': movie_list}
    return render(request, 'backend/index.html', context)


# Rest api end point
def get_movie_list(request):
    """
    Returns Json list of all movies
    """
    if request.method == "GET":
        movie_list = Movie.objects.order_by('title')
        serializer = MovieSerializer(movie_list, many=True)
        return JsonResponse(serializer.data, safe=False)


def get_novel_movies(request, username, num_movies_to_return=10):
    """
    Returns a list of new movies for the user to see
    """
    # Get the user
    # user = (User.objects.filter(username__endswith=username, username__startswith=username))[0]
    user = User.objects.filter(username=username)[0]#, username__startswith=username))[0]

    # Get the movies that the user has liked
    liked_movies = user.liked_movies.all()

    # Get the movies that the user has unliked
    unliked_movies = user.unliked_movies.all()

    # Get the movies in the database, excluding the ones we've already either liked or unliked
    novel_movies = Movie.objects.exclude(id__in = unliked_movies.values_list('id',
        flat=True)).exclude(id__in=liked_movies.values_list('id', flat=True))

    # If there aren't enough movies, populate the DB with more
    while len(novel_movies) < num_movies_to_return:
        # Put more movies into the DB
        populate_new_movies(request, num=10)

        # Get the movies in the database, excluding the ones we've already either liked or unliked
        novel_movies = Movie.objects.exclude(id__in = unliked_movies.values_list('id',
            flat=True)).exclude(id__in=liked_movies.values_list('id', flat=True))

    # Return the top K most popular movies from the lits of novel movies
    sorted_novel_movies = Movie.objects.order_by('-popularity')[:num_movies_to_return]
    serializer = MovieSerializer(sorted_novel_movies, many=True)

    return JsonResponse(serializer.data, safe=False)


def get_intersection(request):
    """
    Returns the intersection of movie preferences of a set of users

    Request GET params should have a comma-separated list of usernames
    """
    usernames = request.GET['usernames'].split(',')

    # Initialize the set of possible movies with the preferences of the first user
    first_user = User.objects.filter(username=usernames[0])[0]
    eligible_movies = first_user.liked_movies.all()

    # Repeatedly filter out movies, by pruning out those that aren't in people's liked_movies sets.
    for username in usernames[1:]:
        user = User.objects.filter(username=username)[0]
        liked_movies = user.liked_movies.all()
        elibigle_movies = eligible_movies.filter(id__in=liked_movies.values_list('id', flat=True))

    serializer = MovieSerializer(eligible_movies, many=True)

    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def rate_movie(request):
    """
    Add the movie to the user's liked_movies or unliked_movies list

    Request should send a JSON object which maps moviedb_id ==> true/false
    response.body = {
        'username':'username_val',
        'moviedb_id_to_rating': {
            int: bool,
            int: bool,
            ...
        }
    }

    """
    data = json.loads(request.body)

    # r = requests.post('http://localhost:8000/backend/api/rate_movie',json={'username':'jomanw', 'moviedb_id_to_rating':[(694919,True),(337401,False)})

    username = data['username']
    moviedb_id_to_rating = data['moviedb_id_to_rating']

    user = User.objects.filter(username=username)[0]
    for moviedb_id in moviedb_id_to_rating:
        likes_movie = moviedb_id_to_rating[moviedb_id]
        movie = Movie.objects.filter(movieDbId=int(moviedb_id))[0]
        if likes_movie:
            user.liked_movies.add(movie)
        else:
            user.unliked_movies.add(movie)

    user.save()

    return HttpResponse("Success")


def get_movie_names(request):
    """
    Returns Json list of all movies
    """
    if request.method == "GET":
        return JsonResponse(list(Movie.objects.all().values_list('title', flat=True)), safe=False)


def get_existing_ids():
    return set(Movie.objects.all().values_list('movieDbId', flat=True))


def add_movie_to_db(movie, construct_img_url):
    new = Movie(title=movie['title'], movieDbId=movie['id'], description=movie['overview'], posterUrl=construct_img_url(movie['poster_path']),
                netflixOk=False, popularity=movie['popularity'])
    new.save()


def create_url_construction_fn():
    url = 'https://api.themoviedb.org/3/configuration?api_key=%s' % API_KEY
    r = requests.get(url)
    if r.status_code == 200:
        response = r.json()
        base_url = response["images"]["base_url"]
        img_size = response["images"]["poster_sizes"][3]

        def construct_url(file_path):
            return base_url + img_size + file_path
    else:
        def construct_url(file_path):
            return 'Image Not Found'

    return construct_url


def populate_new_movies(request, num=50):
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

    return get_movie_list(request)
