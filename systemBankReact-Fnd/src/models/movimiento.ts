export interface Movimiento {
  id: number;
  tipo: "ingreso" | "egreso";
  monto: number;
  fecha: string;
  cuenta_origen: string;
  cuenta_destino: string;
}
