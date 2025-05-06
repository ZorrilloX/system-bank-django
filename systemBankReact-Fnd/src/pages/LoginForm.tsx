import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombres, setNombres] = useState("");
  const [ci, setCi] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false); //para alternar entre login y register

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await AuthService.login(username, password); // AuthService para login
      navigate("/home");
    } catch {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        usuario: username,
        password,
        nombres,
        ci,
      };
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar el usuario. Intenta nuevamente.");
      }

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      setIsRegister(false);
    } catch (error) {
      setError(error.message || "Hubo un problema al registrar el usuario.");
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4">{isRegister ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Usuario"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {isRegister && (
                <>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Nombres"
                      className="form-control"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="CI"
                      className="form-control"
                      value={ci}
                      onChange={(e) => setCi(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100 mb-2">
                {isRegister ? "Registrar" : "Ingresar"}
              </button>
            </form>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="btn btn-link text-white w-100"
            >
              {isRegister ? "Ya tienes cuenta? Inicia sesión" : "No tienes cuenta? Regístrate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
