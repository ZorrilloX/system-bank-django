from django.db import models

from banco.models.usuario import Usuario


class Beneficiario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='beneficiarios')
    nombre = models.CharField(max_length=120)
    numero = models.CharField(max_length=20)

    def __str__(self):
        return f"Beneficiario: {self.nombre} - Cuenta: {self.numero}"
