import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import Inicio from "../pages/Inicio";
import Herramientas from "../pages/Herramientas";
import Soporte from "../pages/herramientas/Soporte";
import Cuenta from "../pages/Cuenta";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Password from "../pages/auth/Password";
import RestablecerContrasena from "../pages/auth/RestablecerContrasena";
import Proveedores from "../pages/Proveedores";
import Usuarios from "../pages/Usuarios";
import Mapa from "../pages/Mapa";
import Boletas from "../pages/Boletas";
import Reseñas from "../pages/Reseñas";
import AcademyHome from "../pages/Academia";
import CursoIndividual from "../pages/academia/CursoIndividual";
import RequireAuth from "../components/auth/RequireAuth";
import RequirePlan from "../components/auth/RequirePlan";
import EditarPerfil from "../pages/perfil/EditarPerfil";
import CambiarContraseña from "../pages/perfil/CambiarContraseña";
import Planes from "../pages/Planes";
import Glosario from "../pages/Glosario";
import Administrador from "../pages/Administrador";
import DetectorProveedor from "../pages/herramientas/InformacionRed";
import TestVelocidad from "../components/tools/TestVelocidad";
import AnalisisConexion from "../pages/herramientas/AnalisisConexion";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "mapa", element: <Mapa /> },
      { path: "herramientas", element: <Herramientas /> },
      { path: "informacion-red", element: <DetectorProveedor /> },
      { path: "test-velocidad", element: <TestVelocidad /> },
      { path: "analisis-conexion", element: <AnalisisConexion /> },
      {
        path: "cuenta",
        element: (
          <RequireAuth>
            <Cuenta />
          </RequireAuth>
        ),
      },
      {
        path: "editar-perfil",
        element: (
          <RequireAuth>
            <EditarPerfil />
          </RequireAuth>
        ),
      },
      {
        path: "cambiar-contraseña",
        element: (
          <RequireAuth>
            <CambiarContraseña />
          </RequireAuth>
        ),
      },
      { path: "soporte", element: <Soporte /> },
      { path: "planes", element: <Planes /> },
      { path: "recuperar-contrasena", element: <Password /> },
      { path: "restablecer-contrasena", element: <RestablecerContrasena /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      {
        path: "resenas",
        element: (
          <RequireAuth>
            <Reseñas />
          </RequireAuth>
        ),
      },
      { path: "proveedores/:id", element: <Proveedores /> },
      { path: "usuarios/:id", element: <Usuarios /> },
      {
        path: "boletas",
        element: (
          <RequirePlan plan="premium">
            <Boletas />
          </RequirePlan>
        ),
      },
      // Rutas que requieren plan premium
      {
        path: "academia",
        element: (
          <RequirePlan plan="premium">
            <AcademyHome />
          </RequirePlan>
        ),
      },
      {
        path: "academia/curso/:id",
        element: (
          <RequirePlan plan="premium">
            <CursoIndividual />
          </RequirePlan>
        ),
      },
      {
        path: "glosario",
        element: (
          <RequirePlan plan="premium">
            <Glosario />
          </RequirePlan>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireAuth>
            <Administrador />
          </RequireAuth>
        ),
      },
    ],
  },
]);
