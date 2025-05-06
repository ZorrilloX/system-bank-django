from django.urls import path, include
from rest_framework import routers

from banco.apis import cuentas, beneficiarios
from banco.apis.beneficiario_viewset import BeneficiarioViewSet
from banco.apis.cuenta_viewset import CuentaViewSet
from banco.apis.transaccion_viewset import TransaccionViewSet
from banco.apis.usuario_viewset import AuthViewSet

auth_view = AuthViewSet.as_view({'post': 'register'})
router = routers.DefaultRouter()
#router.register('cuentas', CuentaViewSet)
#router.register('transacciones', TransaccionViewSet)
#router.register('beneficiarios', BeneficiarioViewSet)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', auth_view, name='auth-register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Para obtener el token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Para refrescar el token

    path('api/cuentas/', cuentas.ver_cuentas, name='ver_cuentas'),
    path('api/cuentas/crear/', cuentas.crear_cuenta, name='crear_cuenta'),
    path('api/cuentas/ingreso/', cuentas.ingreso, name='ingreso'),
    path('api/cuentas/movimientos/<int:cuenta_id>/', cuentas.obtener_movimientos, name='listar_movimientos'),
    path('api/cuentas/egreso/', cuentas.egreso, name='egreso'),
    path('api/cuentas/transferencia/', cuentas.transferencia, name='transferencia'),
    path('api/beneficiarios/', beneficiarios.agregar_beneficiario, name='agregar_beneficiario'),
    path('api/beneficiarios/listar/', beneficiarios.listar_beneficiarios, name='listar_beneficiarios'),
    path('api/beneficiarios/editar/<int:beneficiario_id>/', beneficiarios.editar_beneficiario, name='editar_beneficiario'),
    path('api/beneficiarios/eliminar/<int:beneficiario_id>/', beneficiarios.eliminar_beneficiario, name='eliminar_beneficiario'),
]
