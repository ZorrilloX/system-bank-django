import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ListGroup, Button, Spinner, Alert } from "react-bootstrap";
import apiClient from "../services/apiClient";
import type { Movimiento } from "../models/movimiento";
import { useLocation } from "react-router-dom";

const MovimientosCuenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const { state } = useLocation();
  const numeroCuenta = state?.numero;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMovimientos = async () => {
      try {
        const res = await apiClient.get(`/cuentas/movimientos/${id}/`);
        setMovimientos(res.data);
      } catch {
        setError("Error al cargar movimientos");
      } finally {
        setLoading(false);
      }
    };
    cargarMovimientos();
  }, [id]);

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <div className="container mt-5">
        <h2 className="text-white">Movimientos de tu Cuenta: {numeroCuenta} - {id}</h2>
        <Button variant="secondary" onClick={() => navigate("/home")}>Volver</Button>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {loading ? (
          <Spinner animation="border" className="mt-3" />
        ) : (
          <ListGroup className="mt-3">
            {movimientos.map((m) => (
              <div
                  key={m.id}
                  className={`p-2 mb-2 border rounded ${
                  m.tipo === "ingreso" ? "bg-success text-white" : "bg-danger text-white"
                  }`}
              >
                  <strong>
                  {m.tipo === "ingreso" ? "Ingreso" : "Egreso"}: ${m.monto}
                  </strong>
                  <br />
                  {m.tipo === "ingreso" && m.cuenta_origen !== "Depósito en efectivo" && (
                  <span>De cuenta: {m.cuenta_origen}</span>
                  )}
                  {m.tipo === "ingreso" && m.cuenta_origen === "Depósito en efectivo" && (
                  <span>Depósito en efectivo</span>
                  )}
                  {m.tipo === "egreso" && (
                  <span>Enviado a: {m.cuenta_destino}</span>
                  )}
                  <br />
                  <small className="text-light">Fecha: {new Date(m.fecha).toLocaleString()}</small>
              </div>
          ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default MovimientosCuenta;
