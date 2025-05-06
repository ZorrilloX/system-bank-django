import { useEffect, useState } from "react";
import type { Cuenta } from "../models/cuenta";
import apiClient from "../services/apiClient";
import type { Beneficiario } from "../models/beneficiario";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Spinner } from "react-bootstrap";
import { ModalFormBeneficiario } from "../components/ModalFormBeneficiario";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [beneficiarioSeleccionado, setBeneficiarioSeleccionado] = useState<Beneficiario | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const fetchCuentas = async () => {
    try {
      const response = await apiClient.get("/cuentas/");
      setCuentas(response.data);
    } catch (error) {
      console.error("Error al obtener las cuentas", error);
    }
  };

  const fetchBeneficiarios = async () => {
    try {
      const response = await apiClient.get("/beneficiarios/listar/");
      setBeneficiarios(response.data);
    } catch (error) {
      console.error("Error al obtener los beneficiarios", error);
    }
  };

  const crearCuenta = async () => {
    try {
      await apiClient.post("/cuentas/crear/");
      fetchCuentas();
    } catch (error) {
      console.error("Error al crear cuenta", error);
    }
  };

  const eliminarBeneficiario = async (id: number) => {
    try {
      await apiClient.delete(`/beneficiarios/eliminar/${id}/`);
      fetchBeneficiarios();
    } catch (error) {
      console.error("Error al eliminar beneficiario", error);
    }
  };

  const abrirFormulario = (b?: Beneficiario) => {
    setBeneficiarioSeleccionado(b);
    setModalVisible(true);
  };

  useEffect(() => {
    setLoading(true);
    fetchCuentas();
    fetchBeneficiarios();
    setLoading(false);
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-4">Mis Cuentas</h1>
            <Button title="Crear Nueva Cuenta" onClick={crearCuenta} variant="success" className="me-2"/>
            <Button title=" Transferencia" onClick={() => navigate("/transferencia")} variant= "primary" />

            <div className="row mt-4">
              {/* SECCION PRINCIPAL DE MIS CUENTAS */}
              <div className="col-md-6">
                <Card title="Cuentas">
                  {loading ? (
                    <Spinner animation="border" />
                  ) : (
                    cuentas.map((cuenta) => (
                      <Card key={cuenta.id} title={`Cuenta Nº ${cuenta.numero}`}>
                        <p><strong>Saldo:</strong> ${cuenta.saldo}</p>
                        <Button
                          title="Ver Movimientos"
                          variant="info"
                          onClick={() => navigate(`/cuenta/${cuenta.id}/movimientos`,
                            { state: { numero: cuenta.numero } })}//enviar el numero de cuenta xd
                        />
                      </Card>
                      
                    ))
                  )}
                </Card>
              </div>

              {/* SECCION PRINCIPAL BENEFICIARIOS */}
              <div className="col-md-6">
              <Card title="Beneficiarios">
                <Button title="Agregar Beneficiario" onClick={() => abrirFormulario()} variant="primary" />
                {beneficiarios.map((beneficiario) => (
                    <div
                    key={beneficiario.id}
                    className="d-flex justify-content-between align-items-center bg-secondary text-white p-2 my-2 rounded"
                    >
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => abrirFormulario(beneficiario)}
                    >
                        {beneficiario.nombre} - {beneficiario.numero}
                    </span>
                    <Button
                        title="Eliminar"
                        onClick={() => {
                        eliminarBeneficiario(beneficiario.id);
                        }}
                        variant="danger"
                    />
                    </div>
                ))}
                </Card>
              </div>
            </div>

            <ModalFormBeneficiario
              show={modalVisible}
              onHide={() => setModalVisible(false)}
              beneficiario={beneficiarioSeleccionado}
              onSuccess={fetchBeneficiarios}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
