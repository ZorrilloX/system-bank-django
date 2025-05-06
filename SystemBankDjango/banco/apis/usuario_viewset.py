from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from banco.models import Usuario

class AuthViewSet(viewsets.ViewSet):
    @action(methods=['post'], detail=False, url_path='register')
    def register(self, request):
        username = request.data.get('usuario')
        password = request.data.get('password')
        nombres = request.data.get('nombres')
        ci = request.data.get('ci')

        if not username or not password or not nombres or not ci:
            return Response({'error': 'Faltan campos'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Ese usuario ya existe'}, status=400)

        user = User.objects.create_user(username=username, password=password)
        Usuario.objects.create(user=user, nombres=nombres, ci=ci)

        return Response({'id': user.id, 'usuario': user.username}, status=201)

