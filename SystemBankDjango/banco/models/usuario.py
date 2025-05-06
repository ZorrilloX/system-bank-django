from django.db import models
from django.contrib.auth.models import User


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombres = models.CharField(max_length=100)
    ci = models.CharField(max_length=20)

    def __str__(self):
        return self.nombres