import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../icons/logotipo/imagotipo";
import {
  IconX,
  IconBell,
  IconBellFilled,
  IconSun,
  IconMoon,
  IconChevronDown,
} from "@tabler/icons-react";
import { obtenerNotificacionesBoletas } from "../../services/boletas/notificaciones";
import MainButton from "../ui/MainButton";
import MainLinkButton from "../ui/MainLinkButton";
import { logoutUser } from "../../services/authService";
import { getPerfil } from "../../services/perfil/getPerfil";

export const useNotificaciones = () => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = async () => {
    if (!usuario) return;
    const alertas = await obtenerNotificacionesBoletas(usuario.id);
    setNotificaciones(alertas);
  };

  useEffect(() => {
    cargarNotificaciones();
    const handler = () => cargarNotificaciones();

    window.addEventListener("nueva-boleta", handler);
    return () => window.removeEventListener("nueva-boleta", handler);
  }, [usuario]);

  return { notificaciones, setNotificaciones, cargarNotificaciones };
};

const Navbar = () => {
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [mostrarHerramientas, setMostrarHerramientas] = useState(false);
  const [mostrarPerfilMenu, setMostrarPerfilMenu] = useState(false);

  const { usuario, loading } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();
  const { currentTheme, changeTheme, themeData } = useTheme();
  const location = useLocation();
  const esVistaMapa = location.pathname === "/mapa";

  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!usuario) {
        setPerfil(null);
        return;
      }
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (err) {
        console.error("Error al cargar perfil en Navbar:", err);
      }
    };

    cargarPerfil();

    // Escuchar evento de actualización de perfil
    const handler = () => cargarPerfil();
    window.addEventListener("perfil-actualizado", handler);
    
    return () => window.removeEventListener("perfil-actualizado", handler);
  }, [usuario]);

  const getLogoColorPrincipal = () => {
    if (currentTheme === "light") {
      return "#1f2a40";
    }
    return themeData?.texto || "#FFFFFF";
  };

  const openOnly = (menu) => {
    setMostrarHerramientas(menu === "tools");
    setMostrarNotis(menu === "notis");
    setMostrarPerfilMenu(menu === "perfil");
  };

  const getThemeIcon = () => {
    return currentTheme === "light" ? IconSun : IconMoon;
  };

  const toggleTheme = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    changeTheme(nextTheme);
  };

  const getUserDisplayName = () => {
    if (!usuario) return "Usuario";
    return (
      perfil?.nombre ||
      usuario.user_metadata?.name ||
      usuario.email ||
      "Usuario"
    );
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const getUserAvatarUrl = () => {
    if (!usuario) return null;
    return perfil?.foto_url || usuario.user_metadata?.foto_perfil || null;
  };

  const avatarUrl = getUserAvatarUrl();

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:block px-4 py-4 ${
          currentTheme === "light"
            ? "bg-fondo shadow-lg border-b border-texto/15"
            : "bg-fondo shadow-lg border-b border-texto/15"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <Link to="/" className="flex items-center gap-2">
            <Logo
              className="h-10"
              colorPrincipal={getLogoColorPrincipal()}
              colorAcento={themeData?.acento || "#FB8531"}
            />
          </Link>

          <div className="flex items-center space-x-4">
            <MainLinkButton to="/" variant="navbar" className="!px-4 !py-2">
              Inicio
            </MainLinkButton>

            {/* Herramientas (Dropdown) */}
            <div className="relative">
              <MainButton
                onClick={() => {
                  setMostrarHerramientas((v) => !v);
                  setMostrarNotis(false);
                  setMostrarPerfilMenu(false);
                  openOnly(mostrarHerramientas ? null : "tools");
                }}
                variant="navbar"
                title="Herramientas"
                aria-expanded={mostrarHerramientas}
              >
                Herramientas
                <IconChevronDown
                  size={18}
                  className={`transition-transform ${
                    mostrarHerramientas ? "rotate-180" : "rotate-0"
                  }`}
                />
              </MainButton>

              {mostrarHerramientas && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                      setMostrarHerramientas(false);
                      openOnly(null);
                    }}
                  />
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 p-2 space-y-1 ${
                      currentTheme === "light"
                        ? "bg-fondo border border-texto/15 text-texto"
                        : "bg-fondo text-texto border border-texto/15"
                    }`}
                  >
                    <MainLinkButton
                      to="/herramientas"
                      variant="navbar"
                      className="!w-full !justify-start !px-3 !py-2"
                      onClick={() => setMostrarHerramientas(false)}
                    >
                      Todas las herramientas
                    </MainLinkButton>
                    <div className="ml-1 pl-2 mt-1 space-y-1 border-l border-texto/15">
                      <MainLinkButton
                        to="/mapa"
                        variant="navbar"
                        className="!w-full !justify-start !px-3 !py-2"
                        onClick={() => setMostrarHerramientas(false)}
                      >
                        Mapa
                      </MainLinkButton>

                      <MainLinkButton
                        to="/informacion-red"
                        variant="navbar"
                        className="!w-full !justify-start !px-3 !py-2"
                        onClick={() => setMostrarHerramientas(false)}
                      >
                        Información de red
                      </MainLinkButton>

                      <MainLinkButton
                        to="/test-velocidad"
                        variant="navbar"
                        className="!w-full !justify-start !px-3 !py-2"
                        onClick={() => setMostrarHerramientas(false)}
                      >
                        Test de velocidad
                      </MainLinkButton>

                      <MainLinkButton
                        to="/analisis-conexion"
                        variant="navbar"
                        className="!w-full !justify-start !px-3 !py-2"
                        onClick={() => setMostrarHerramientas(false)}
                      >
                        Análisis de conexión
                      </MainLinkButton>

                      <MainLinkButton
                        to="/soporte"
                        variant="navbar"
                        className="!w-full !justify-start !px-3 !py-2"
                        onClick={() => setMostrarHerramientas(false)}
                      >
                        Soporte
                      </MainLinkButton>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Botón de tema */}
            <MainButton
              onClick={toggleTheme}
              variant="navbar"
              icon={getThemeIcon()}
              iconSize={26}
              title={`Cambiar a tema ${
                currentTheme === "light" ? "oscuro" : "claro"
              }`}
            />

            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-texto/30 border-t-acento rounded-full animate-spin"></div>
                <span className="text-sm text-texto/75">Cargando...</span>
              </div>
            ) : !usuario ? (
              <MainLinkButton
                to="/login"
                variant="accent"
                className="px-3 py-1 hover:scale-105"
              >
                Iniciar sesión
              </MainLinkButton>
            ) : (
              <>
                {/* Notificaciones */}
                <div className="relative">
                  <MainButton
                    onClick={() => {
                      setMostrarNotis(!mostrarNotis);
                      setMostrarHerramientas(false);
                      setMostrarPerfilMenu(false);
                      openOnly(mostrarNotis ? null : "notis");
                    }}
                    variant="navbar"
                    className={`relative${
                      notificaciones.length > 0 ? "animate-bounce" : ""
                    }`}
                    icon={
                      notificaciones.length > 0
                        ? () => (
                            <IconBellFilled size={26} className="text-acento" />
                          )
                        : IconBell
                    }
                    iconSize={26}
                    title="Notificaciones"
                  >
                    {notificaciones.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-900 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                        {notificaciones.length}
                      </span>
                    )}
                  </MainButton>

                  {mostrarNotis && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                          setMostrarNotis(false);
                          openOnly(null);
                        }}
                      />
                      <div
                        className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50 p-4 space-y-2 ${
                          currentTheme === "light"
                            ? "bg-fondo text-texto border border-texto/15 "
                            : "bg-fondo text-texto border border-texto/15"
                        }`}
                      >
                        {notificaciones.length === 0 ? (
                          <p className="italic text-center">
                            No hay notificaciones
                          </p>
                        ) : (
                          notificaciones.map((msg, i) => (
                            <div
                              key={i}
                              className={`border-b pb-2 last:border-b-0 flex justify-between items-start gap-2 ${
                                currentTheme === "light"
                                  ? "border-texto/15"
                                  : "border-texto/15"
                              }`}
                            >
                              <span className="break-words">{msg}</span>
                              <MainButton
                                onClick={() =>
                                  setNotificaciones((prev) =>
                                    prev.filter((_, idx) => idx !== i)
                                  )
                                }
                                variant="cross"
                                title="Cerrar"
                                icon={IconX}
                                iconSize={20}
                                className="leading-none p-0"
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Perfil (Dropdown) */}
                <div className="relative">
                  <MainButton
                    onClick={() => {
                      setMostrarPerfilMenu((v) => !v);
                      setMostrarHerramientas(false);
                      setMostrarNotis(false);
                      openOnly(mostrarPerfilMenu ? null : "perfil");
                    }}
                    variant="navbar"
                    title="Perfil"
                    aria-expanded={mostrarPerfilMenu}
                    className="!px-2 !py-1 flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={getUserDisplayName()}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-acento/10 flex items-center justify-center text-sm font-medium text-acento">
                          {getUserInitial()}
                        </div>
                      )}
                      <span className="max-w-[140px] truncate text-sm text-left">
                        {getUserDisplayName()}
                      </span>
                    </div>
                    <IconChevronDown
                      size={18}
                      className={`transition-transform ${
                        mostrarPerfilMenu ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </MainButton>

                  {mostrarPerfilMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                          setMostrarPerfilMenu(false);
                          openOnly(null);
                        }}
                      />
                      <div
                        className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 p-2 space-y-1 ${
                          currentTheme === "light"
                            ? "bg-fondo border border-texto/15 text-texto"
                            : "bg-fondo text-texto border border-texto/15"
                        }`}
                      >
                        <MainLinkButton
                          to="/cuenta"
                          variant="navbar"
                          className="!w-full !justify-start !px-3 !py-2"
                          onClick={() => setMostrarPerfilMenu(false)}
                        >
                          Ver mi perfil
                        </MainLinkButton>

                        <div className="ml-1 pl-2 mt-1 space-y-1 border-l border-texto/15">
                          <MainLinkButton
                            to="/boletas"
                            variant="navbar"
                            className="!w-full !justify-start !px-3 !py-2"
                            onClick={() => setMostrarPerfilMenu(false)}
                          >
                            Gestionar boletas
                          </MainLinkButton>

                          <MainLinkButton
                            to="/academia"
                            variant="navbar"
                            className="!w-full !justify-start !px-3 !py-2"
                            onClick={() => setMostrarPerfilMenu(false)}
                          >
                            Academia Red-Fi
                          </MainLinkButton>

                          <MainLinkButton
                            to="/resenas"
                            variant="navbar"
                            className="!w-full !justify-start !px-3 !py-2"
                            onClick={() => setMostrarPerfilMenu(false)}
                          >
                            Mis reseñas
                          </MainLinkButton>

                          <MainLinkButton
                            to="/editar-perfil"
                            variant="navbar"
                            className="!w-full !justify-start !px-3 !py-2"
                            onClick={() => setMostrarPerfilMenu(false)}
                          >
                            Editar perfil
                          </MainLinkButton>

                          <MainLinkButton
                            to="/planes"
                            variant="navbar"
                            className="!w-full !justify-start !px-3 !py-2"
                            onClick={() => setMostrarPerfilMenu(false)}
                          >
                            Gestionar plan
                          </MainLinkButton>

                          <MainLinkButton
                            to="/glosario"
                            variant="navbar"
                            className="!w-full !justify-start !px-3 !py-2"
                            onClick={() => setMostrarPerfilMenu(false)}
                          >
                            Glosario de redes
                          </MainLinkButton>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <MainButton
                  onClick={async () => {
                    await logoutUser();
                  }}
                  variant="danger"
                  className="px-3 py-1 hover:scale-105"
                >
                  Cerrar sesión
                </MainButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      {!esVistaMapa && (
        <nav
          className={`lg:hidden px-4 py-4 ${
            currentTheme === "light"
              ? "bg-fondo shadow-lg border-b border-texto/15"
              : "bg-fondo shadow-lg border-b border-texto/15"
          }`}
        >
          <div className="flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo
                className="h-8"
                colorPrincipal={getLogoColorPrincipal()}
                colorAcento={themeData?.acento || "#FB8531"}
              />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
