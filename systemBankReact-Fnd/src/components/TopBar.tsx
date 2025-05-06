import { useNavigate } from "react-router-dom";

const TopBar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/login"); //redirigir a login al cerrar sesión
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <h2>Mi Aplicación Bancaria</h2>
            <button onClick={handleLogout} style={{
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer"
            }}>
                Cerrar Sesión
            </button>
        </div>
    );
};

export default TopBar;