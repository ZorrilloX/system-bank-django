from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from banco import models
from django.db.models import Q
from banco.models import Cuenta, Beneficiario
from banco.models import Transaccion
from decimal import Decimal

@api_view(['POST'])
def crear_cuenta(request):
    usuario = request.user  #el usuario autenticado será el dueño de la cuenta
    cuenta = Cuenta.objects.create(usuario=usuario, saldo=0) #crear cuenta
    return Response({"mensaje": f"Cuenta creada con número {cuenta.numero}"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def ver_cuentas(request):
    cuentas = Cuenta.objects.filter(usuario=request.user)
    data = [{"id": cuenta.id, "numero": cuenta.numero, "saldo": cuenta.saldo} for cuenta in cuentas]
    return Response(data)


@api_view(['POST'])
def ingreso(request):
    cuenta_id = request.data.get('cuenta_id')
    monto = Decimal(request.data.get('monto'))

    try:
        cuenta = Cuenta.objects.get(id=cuenta_id, usuario=request.user)
    except Cuenta.DoesNotExist:
        return Response({"error": "Cuenta no encontrada o no pertenece al usuario"}, status=404)

    cuenta.saldo += monto
    cuenta.save()

    Transaccion.objects.create(
        cuentaOrigen=None,
        monto=monto,
        tipo='ingreso',
        cuentaDestino=cuenta,
        es_principal = True
    )
    return Response({"mensaje": "Ingreso exitoso"}, status=200)


@api_view(['POST'])
def egreso(request):
    cuenta_id = request.data.get('cuenta_id')
    monto = Decimal(request.data.get('monto'))

    try:
        cuenta = Cuenta.objects.get(id=cuenta_id, usuario=request.user)
    except Cuenta.DoesNotExist:
        return Response({"error": "Cuenta no encontrada o no pertenece al usuario"}, status=404)

    if cuenta.saldo < monto:
        return Response({"error": "Saldo insuficiente"}, status=400)

    cuenta.saldo -= monto
    cuenta.save()

    Transaccion.objects.create(
        cuentaOrigen=cuenta,
        monto=monto,
        tipo='egreso',
        cuentaDestino=None,
        es_principal = True
    )
    return Response({"mensaje": "Egreso exitoso"}, status=200)


@api_view(['POST'])
def transferencia(request):
    origen_id = request.data.get('cuenta_origen_id')
    numero_destino = request.data.get('cuenta_destino_numero')  #numero de cuenta de beneficiario
    monto = Decimal(request.data.get('monto'))

    try:
        cuenta_origen = Cuenta.objects.get(id=origen_id, usuario=request.user)
    except Cuenta.DoesNotExist:
        return Response({"error": "La cuenta origen no existe o no tienes acceso a ella"}, status=status.HTTP_404_NOT_FOUND)

    #validaciones de cuentas:
    try:
        beneficiario = Beneficiario.objects.get(usuario=request.user.usuario, numero=numero_destino)
        cuenta_destino = Cuenta.objects.get(numero=beneficiario.numero)  # existe la cuenta destino, usando el número del beneficiario
    except Beneficiario.DoesNotExist:
        return Response({"error": "La cuenta destino no es un beneficiario válido"}, status=status.HTTP_400_BAD_REQUEST)
    except Cuenta.DoesNotExist:
        return Response({"error": "Cuenta destino no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    # tenemos la suficiente plata?
    if cuenta_origen.saldo < monto:
        return Response({"error": "Saldo insuficiente"}, status=status.HTTP_400_BAD_REQUEST)

    cuenta_origen.saldo -= monto
    cuenta_destino.saldo += monto
    cuenta_origen.save()
    cuenta_destino.save()

    # Registrar transacción de egreso en cuenta origen
    Transaccion.objects.create(
        cuentaOrigen=cuenta_origen,
        cuentaDestino=cuenta_destino,
        monto=monto,
        tipo='egreso',
        es_principal=True  #transacción principal
    )

    # Registrar transacción de ingreso en cuenta destino
    Transaccion.objects.create(
        cuentaOrigen=cuenta_origen,
        cuentaDestino=cuenta_destino,
        monto=monto,
        tipo='ingreso',
        es_principal=False  #transacción secundaria
    )

    return Response({"mensaje": "Transferencia exitosa"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def obtener_movimientos(request, cuenta_id):
    try:
        cuenta = Cuenta.objects.get(id=cuenta_id, usuario=request.user)

        ingresos = Transaccion.objects.filter(
            cuentaDestino=cuenta,
            tipo='ingreso'
        ).filter(
            Q(es_principal=False) | Q(cuentaOrigen=None, es_principal=True)
        )

        egresos = Transaccion.objects.filter(
            cuentaOrigen=cuenta,
            tipo='egreso',
            es_principal=True
        )

        movimientos = list(ingresos) + list(egresos)
        movimientos.sort(key=lambda x: x.fecha, reverse=True)

        data = [
            {
                "id": t.id,
                "monto": t.monto,
                "fecha": t.fecha,
                "tipo": t.tipo,
                "cuenta_origen": t.cuentaOrigen.numero if t.cuentaOrigen else "Depósito en efectivo",
                "cuenta_destino": t.cuentaDestino.numero if t.cuentaDestino else "Retiro en efectivo"
            }
            for t in movimientos
        ]

        return Response(data, status=status.HTTP_200_OK)

    except Cuenta.DoesNotExist:
        return Response({"error": "Cuenta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
