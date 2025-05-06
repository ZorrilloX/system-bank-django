from rest_framework import serializers, viewsets
from banco.models import Beneficiario, Usuario
from rest_framework.permissions import IsAuthenticated

class BeneficiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiario
        fields = '__all__'
        read_only_fields = ['usuario']

class BeneficiarioViewSet(viewsets.ModelViewSet):
    queryset = Beneficiario.objects.all()
    serializer_class = BeneficiarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Beneficiario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        usuario = Usuario.objects.get(user=self.request.user)
        serializer.save(usuario=usuario)
