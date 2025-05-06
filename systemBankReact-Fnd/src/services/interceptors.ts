import axios from "axios";

const apiClient = axios.create({
  // Crear cliente API con configuración base
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Agregar interceptor para incluir el token en cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejo global de respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error.response);

    // Manejar expiración de token JWT
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token"); // Elimina token si es inválido
      window.location.href = "/login"; // Redirige al usuario
    }

    return Promise.reject(error);
  }
);

export default apiClient;
