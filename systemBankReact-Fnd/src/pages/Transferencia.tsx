import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import type { Cuenta } from "../models/cuenta";
import type { Beneficiario } from "../models/beneficiario";

const Transferencia = () => {
  const [tipo, setTipo] = useState<"ingreso" | "egreso" | "transferencia">("ingreso");
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [beneficiarioNumero, setBeneficiarioNumero] = useState<number | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentasRes = await apiClient.get("/cuentas/");
        setCuentas(cuentasRes.data);
        const beneficiariosRes = await apiClient.get("/beneficiarios/listar/");
        setBeneficiarios(beneficiariosRes.data);
      } catch (err) {
        setError("Error al cargar datos");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tipo === "ingreso") {
        await apiClient.post("/cuentas/ingreso/", {
          cuenta_id: cuentaId,
          monto,
        });
      } else if (tipo === "egreso") {
        await apiClient.post("/cuentas/egreso/", {
          cuenta_id: cuentaId,
          monto,
        });
      } else if (tipo === "transferencia") {
        await apiClient.post("/cuentas/transferencia/", {
          cuenta_origen_id: cuentaId,
          cuenta_destino_numero: beneficiarioNumero,
          monto,
        });
      }
      navigate("/home");
    } catch (err: any) {
      const responseError = err.response?.data?.error || "Error al procesar la operación";
      setError(responseError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <div className="container mt-5">
        <h2 className="text-white">Operación: {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h2>
        <div className="btn-group mb-3">
          <Button variant={tipo === "ingreso" ? "primary" : "outline-primary"} onClick={() => setTipo("ingreso")}>
            Ingreso
          </Button>
          <Button variant={tipo === "egreso" ? "primary" : "outline-primary"} onClick={() => setTipo("egreso")}>
            Egreso
          </Button>
          <Button variant={tipo === "transferencia" ? "primary" : "outline-primary"} onClick={() => setTipo("transferencia")}>
            Transferencia
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Cuenta</Form.Label>
            <Form.Select
              value={cuentaId ?? ""}
              onChange={(e) => setCuentaId(Number(e.target.value))}
              required
            >
              <option value="">Seleccione una cuenta</option>
              {cuentas.map((cuenta) => (
                <option key={cuenta.id} value={cuenta.id}>
                  {cuenta.numero} - Saldo: ${cuenta.saldo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {tipo === "transferencia" && (
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Beneficiario</Form.Label>
              <Form.Select
                value={beneficiarioNumero ?? ""}
                onChange={(e) => setBeneficiarioNumero(Number(e.target.value))}
                required
              >
                <option value="">Seleccione un beneficiario</option>
                {beneficiarios.map((b) => (
                  <option key={b.id} value={b.numero}>
                    {b.nombre} - {b.numero}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Monto</Form.Label>
            <Form.Control
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
              min={0.01}
              step={0.01}
            />
          </Form.Group>

          <Button type="submit" variant="success" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Confirmar"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Transferencia;
