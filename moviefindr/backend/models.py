from django.db import models
import django.contrib.admin
# Create your models here.

class Movie(models.Model):
    title = models.CharField(max_length=200)
    movieDbId = models.IntegerField()
    description = models.TextField()
    posterUrl = models.CharField(max_length=1000)
    netflixOk = models.BooleanField()
    # posterImage = models.ImageField(upload_to='backend/posters',null=True,blank=True)

    def __str__(self):
        return self.title

class User(models.Model):
    username = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    liked_movies = models.ManyToManyField(Movie, related_name="liked_movies")
    unliked_movies = models.ManyToManyField(Movie, related_name="unliked_movies")

    def __str__(self):
        return self.username
