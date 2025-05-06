from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from banco.models import Beneficiario, Cuenta, Usuario


@api_view(['POST'])
def agregar_beneficiario(request):
    nombre = request.data.get('nombre')
    numero = request.data.get('numero')

    try:
        cuenta = Cuenta.objects.get(numero=numero)
    except Cuenta.DoesNotExist:
        return Response({"error": "No existe una cuenta con ese número"}, status=status.HTTP_400_BAD_REQUEST)

    usuario_actual = Usuario.objects.get(user=request.user)

    print(f"Cuenta Usuario ID en DB: {cuenta.usuario.id}, Usuario Actual ID: {usuario_actual.user.id}")
    print(f"Cuenta Usuario en DB: {cuenta.usuario.username}, Usuario Actual: {usuario_actual.user.username}")

    #validaciones:
    if cuenta.usuario.id == usuario_actual.user.id:
        return Response({"error": "No puedes agregarte a ti mismo como beneficiario"}, status=status.HTTP_400_BAD_REQUEST)

    if Beneficiario.objects.filter(usuario=usuario_actual, numero=numero).exists():
        return Response({"error": "Ese beneficiario ya está registrado"}, status=status.HTTP_400_BAD_REQUEST)

    beneficiario = Beneficiario.objects.create(usuario=usuario_actual, nombre=nombre, numero=numero)
    return Response({"mensaje": "Beneficiario agregado con éxito"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def listar_beneficiarios(request):
    try:
        usuario_actual = Usuario.objects.get(user=request.user)
        beneficiarios = Beneficiario.objects.filter(usuario=usuario_actual)
        data = [{"id": b.id, "nombre": b.nombre, "numero": b.numero} for b in beneficiarios]
        return Response(data, status=status.HTTP_200_OK)
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def eliminar_beneficiario(request, beneficiario_id):
    try:
        usuario_actual = Usuario.objects.get(user=request.user)
        beneficiario = Beneficiario.objects.get(id=beneficiario_id)

        if beneficiario.usuario != usuario_actual:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        beneficiario.delete()
        return Response({"mensaje": "Beneficiario eliminado con éxito"}, status=status.HTTP_204_NO_CONTENT)

    except Beneficiario.DoesNotExist:
        return Response({"error": "Beneficiario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def editar_beneficiario(request, beneficiario_id):
    try:
        usuario_actual = Usuario.objects.get(user=request.user)
        beneficiario = Beneficiario.objects.get(id=beneficiario_id)

        if beneficiario.usuario != usuario_actual:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        nuevo_nombre = request.data.get('nombre')
        nuevo_numero = request.data.get('numero')

        if nuevo_numero:
            try:
                cuenta = Cuenta.objects.get(numero=nuevo_numero)
                if cuenta.usuario.id == usuario_actual.user.id:
                    return Response({"error": "No puedes ponerte como tu propio beneficiario"}, status=status.HTTP_400_BAD_REQUEST)
                beneficiario.numero = nuevo_numero
            except Cuenta.DoesNotExist:
                return Response({"error": "No existe una cuenta con ese número"}, status=status.HTTP_400_BAD_REQUEST)

        if nuevo_nombre:
            beneficiario.nombre = nuevo_nombre

        beneficiario.save()
        return Response({"mensaje": "Beneficiario actualizado con éxito"}, status=status.HTTP_200_OK)

    except Beneficiario.DoesNotExist:
        return Response({"error": "Beneficiario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
