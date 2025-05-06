import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";

type Props = {
  show: boolean;
  onHide: () => void;
  beneficiario?: { id?: number; nombre: string; numero: number };
  onSuccess: () => void;
};

export const ModalFormBeneficiario = ({ show, onHide, beneficiario, onSuccess }: Props) => {
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setNombre(beneficiario?.nombre || "");
    setNumero(beneficiario?.numero?.toString() || "");
    setErrorMsg("");
  }, [beneficiario]);

  const handleSubmit = async () => {
    try {
      const payload = { nombre, numero: Number(numero) };
      if (beneficiario?.id) {
        await apiClient.put(`/beneficiarios/editar/${beneficiario.id}/`, payload);
      } else {
        await apiClient.post("/beneficiarios/", payload);
      }
      onSuccess();
      onHide();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Error desconocido";
      setErrorMsg(msg);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{beneficiario?.id ? "Editar" : "Agregar"} Beneficiario</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-dark">
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Número</Form.Label>
            <Form.Control value={numero} onChange={(e) => setNumero(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};
