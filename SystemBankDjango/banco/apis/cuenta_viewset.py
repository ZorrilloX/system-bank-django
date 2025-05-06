from rest_framework import serializers, viewsets
from banco.models import Cuenta

from rest_framework import serializers

class CuentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuenta
        fields = ['numero', 'saldo']  # Incluir todos los campos, pero no requerir 'usuario' ni 'saldo'
        read_only_fields = ['saldo']

    def create(self, validated_data):
        # Obtén el usuario autenticado del contexto
        usuario = self.context['request'].user
        # Asignar automáticamente el saldo como 0 y el usuario
        cuenta = Cuenta.objects.create(usuario=usuario, saldo=0)
        return cuenta


class CuentaViewSet(viewsets.ModelViewSet):
    queryset = Cuenta.objects.all()
    serializer_class = CuentaSerializer

    def get_queryset(self):
        # Filtrar cuentas por el usuario autenticado
        return Cuenta.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asignar la cuenta al usuario autenticado
        serializer.save(usuario=self.request.user)