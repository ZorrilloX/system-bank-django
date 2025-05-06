from rest_framework import serializers, viewsets
from banco.models import Transaccion
from rest_framework.permissions import IsAuthenticated

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaccion
        fields = '__all__'

class TransaccionViewSet(viewsets.ModelViewSet):
    queryset = Transaccion.objects.all()
    serializer_class = TransaccionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaccion.objects.filter(cuentaOrigen__usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(cuentaOrigen=self.request.user.cuentas.first())
