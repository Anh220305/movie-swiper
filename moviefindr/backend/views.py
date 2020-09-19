from django.shortcuts import render
from django.http import JsonResponse
from .models import Movie
from .serializers import MovieSerializer
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def index(request):
    rest_list = Movie.objects.order_by('title')
    context = {'rest_list': rest_list}
    return render(request, 'backend/index.html', context)


# Rest api end point
def get_movie_list(request):
    """
    Returns Json list of all movies
    """
    if request.method == "GET":
        rest_list = Movie.objects.order_by('-pub_date')
        serializer = MovieSerializer(rest_list, many=True)
        return JsonResponse(serializer.data, safe=False)
