from rest_framework import serializers
from backend.models import Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ("title", "movieDbId", "description", "posterUrl", "netflixOk")#, "posterImage")
