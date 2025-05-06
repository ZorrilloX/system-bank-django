import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "../pages/LoginForm";
import Home from "../pages/Home";
import TopBar from "../components/TopBar";
import { URLS } from "./CONTANTS";
import Transferencia from "../pages/Transferencia";
import MovimientosCuenta from "../pages/MovimientosCuenta";

const RouterConfig = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === URLS.LOGIN;
  const token = localStorage.getItem("access_token");

  // Si no hay token y no estamos en /login, redirige de inmediato
  if (!token && !isLoginPage) return <Navigate to={URLS.LOGIN} />;

  return (
    <>
      {!isLoginPage && <TopBar />}
      <Routes>
        <Route path={URLS.LOGIN} element={<LoginForm />} />
        <Route path={URLS.HOME} element={<Home />} />
        <Route path={URLS.TRANSFERENCIA} element={<Transferencia />} />
        <Route path= "/cuenta/:id/movimientos" element={<MovimientosCuenta/>} />
      </Routes>
    </>
  );
};

export default RouterConfig;
