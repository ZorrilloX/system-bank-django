from django.db import models

class Transaccion(models.Model):
    TIPO_CHOICES = [
        ('ingreso', 'Ingreso'),
        ('egreso', 'Egreso'),
    ]
    cuentaOrigen = models.ForeignKey('Cuenta',null=True, blank=True, on_delete=models.CASCADE, related_name='transacciones_origen')
    cuentaDestino = models.ForeignKey('Cuenta', null=True, blank=True, on_delete=models.CASCADE, related_name='transacciones_destino')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)
    fecha = models.DateTimeField(auto_now_add=True)
    es_principal = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.tipo} de {self.monto} en {self.cuentaOrigen.numero}"
