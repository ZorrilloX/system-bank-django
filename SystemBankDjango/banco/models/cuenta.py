from django.db import models
from django.contrib.auth.models import User

def generar_numero_cuenta():
    import random
    from banco.models import Cuenta
    while True:
        numero = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        if not Cuenta.objects.filter(numero=numero).exists():
            return numero


class Cuenta(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cuentas')
    numero = models.CharField(max_length=6, unique=True, default=generar_numero_cuenta)
    saldo = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Cuenta {self.numero} - {self.usuario.username}"

