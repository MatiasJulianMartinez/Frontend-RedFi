import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  IconX,
  IconBell,
  IconBellFilled,
  IconHome,
  IconTool,
  IconDots,
  IconLogout,
  IconSun,
  IconMoon,
  IconChevronDown,
} from "@tabler/icons-react";
import { useNotificaciones } from "./Navbar";
import MainButton from "../ui/MainButton";
import MainLinkButton from "../ui/MainLinkButton";
import { logoutUser } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { getPerfil } from "../../services/perfil/getPerfil";

const MobileBottomNav = () => {
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const { usuario, loading } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();
  const [mostrarHerramientas, setMostrarHerramientas] = useState(false);
  const location = useLocation();

  const { currentTheme, changeTheme } = useTheme();

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
        console.error("Error al cargar perfil en MobileBottomNav:", err);
      }
    };

    cargarPerfil();

    // Escuchar evento de actualización de perfil
    const handler = () => cargarPerfil();
    window.addEventListener("perfil-actualizado", handler);
    
    return () => window.removeEventListener("perfil-actualizado", handler);
  }, [usuario]);

  const toggleTheme = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    changeTheme(nextTheme);
  };

  const openOnly = (menu) => {
    setMostrarHerramientas(menu === "tools");
    setMostrarNotis(menu === "notis");
    setMostrarMenu(menu === "menu");
  };

  const mainNavigationItems = [{ path: "/", label: "Inicio", icon: IconHome }];

  const isActive = (path) => location.pathname === path;

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
      {/* Mobile Bottom Navigation */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[9999] safe-area-inset-bottom ${
          currentTheme === "light"
            ? "bg-fondo border-t border-texto/15 shadow-lg"
            : "bg-fondo border-t border-texto/15 shadow-lg"
        }`}
      >
        <div className="flex justify-around items-center py-3 px-2">
          {/* Main Navigation Items*/}
          {mainNavigationItems.map(({ path, label, icon: Icon }) => (
            <MainLinkButton
              key={path}
              to={path}
              variant="navbarIcon"
              className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent ${
                isActive(path)
                  ? "!text-acento !scale-110"
                  : currentTheme === "light"
                  ? "!text-texto"
                  : "!text-texto"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </MainLinkButton>
          ))}

          {/* Herramientas (Dropdown) */}
          <div className="relative">
            <MainButton
              onClick={() => {
                setMostrarHerramientas((v) => !v);
                setMostrarMenu(false);
                setMostrarNotis(false);
                openOnly(mostrarHerramientas ? null : "tools");
              }}
              variant="navbar"
              className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent border-0
              ${mostrarHerramientas ? "!text-acento !scale-110" : ""}`}
              icon={IconTool}
              iconSize={22}
              iconAlwaysVisible
              aria-expanded={mostrarHerramientas}
            >
              <span className="text-xs mt-1 font-medium flex items-center gap-1">
                Herramientas
                <IconChevronDown
                  size={14}
                  className={`transition-transform ${
                    mostrarHerramientas ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </MainButton>

            {mostrarHerramientas && (
              <>
                {/* Overlay para cerrar el dropdown en móvil */}
                <div
                  className="fixed inset-0 z-40 lg:hidden"
                  onClick={() => setMostrarHerramientas(false)}
                />
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 rounded-lg shadow-lg z-50 p-2 space-y-1 ${
                    currentTheme === "light"
                      ? "bg-fondo border border-texto/15 text-texto"
                      : "bg-fondo text-texto border border-texto/15"
                  }`}
                >
                  <MainLinkButton
                    to="/herramientas"
                    onClick={() => setMostrarHerramientas(false)}
                    variant="navbar"
                    className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                      location.pathname === "/herramientas"
                        ? "!text-acento"
                        : ""
                    }`}
                  >
                    Todas las herramientas
                  </MainLinkButton>

                  {/* Grupo indentado */}
                  <div className="ml-2 pl-3 mt-1 space-y-1 border-l border-texto/15">
                    <MainLinkButton
                      to="/mapa"
                      onClick={() => setMostrarHerramientas(false)}
                      variant="navbar"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        location.pathname === "/mapa" ? "!text-acento" : ""
                      }`}
                    >
                      Mapa
                    </MainLinkButton>

                    <MainLinkButton
                      to="/informacion-red"
                      onClick={() => setMostrarHerramientas(false)}
                      variant="navbar"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        location.pathname === "/informacion-red"
                          ? "!text-acento"
                          : ""
                      }`}
                    >
                      Información de red
                    </MainLinkButton>

                    <MainLinkButton
                      to="/test-velocidad"
                      onClick={() => setMostrarHerramientas(false)}
                      variant="navbar"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        location.pathname === "/test-velocidad"
                          ? "!text-acento"
                          : ""
                      }`}
                    >
                      Test de velocidad
                    </MainLinkButton>

                    <MainLinkButton
                      to="/analisis-conexion"
                      onClick={() => setMostrarHerramientas(false)}
                      variant="navbar"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        location.pathname === "/analisis-conexion"
                          ? "!text-acento"
                          : ""
                      }`}
                    >
                      Análisis de conexión
                    </MainLinkButton>

                    <MainLinkButton
                      to="/soporte"
                      onClick={() => setMostrarHerramientas(false)}
                      variant="navbar"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        location.pathname === "/soporte" ? "!text-acento" : ""
                      }`}
                    >
                      Soporte
                    </MainLinkButton>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications Icon para Mobile*/}
          {!loading && usuario && (
            <div className="relative">
              <MainButton
                onClick={() => {
                  setMostrarNotis(!mostrarNotis);
                  openOnly(mostrarNotis ? null : "notis");
                }}
                variant="navbar"
                className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent ${
                  notificaciones.length > 0
                    ? "!text-acento"
                    : currentTheme === "light"
                    ? "!text-texto"
                    : "!text-texto"
                }`}
                icon={notificaciones.length > 0 ? IconBellFilled : IconBell}
                iconSize={22}
                iconAlwaysVisible={true}
              >
                <span className="text-xs mt-1 font-medium flex items-center gap-1">
                  Alertas
                </span>
                {notificaciones.length > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-900 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                    {notificaciones.length}
                  </span>
                )}
              </MainButton>

              {mostrarNotis && (
                <>
                  {/* Overlay para cerrar el dropdown en móvil */}
                  <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setMostrarNotis(false)}
                  />
                  <div
                    className={`fixed bottom-24 left-4 right-4 z-50 rounded-lg shadow-lg p-4 space-y-2 
                      sm:absolute sm:bottom-full sm:right-0 sm:left-auto sm:w-72 mb-2 ${
                        currentTheme === "light"
                          ? "bg-fondo border border-texto/15 text-texto"
                          : "bg-fondo text-texto border border-texto/15"
                      }`}
                  >
                    {notificaciones.length === 0 ? (
                      <p className="italic text-center">Sin notificaciones</p>
                    ) : (
                      notificaciones.map((msg, i) => (
                        <div
                          key={i}
                          className={`border-b last:border-b-0 flex justify-between items-center gap-2 ${
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
                            iconAlwaysVisible={true}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* More Menu Button usando MainButton */}
          <div className="relative">
            <MainButton
              onClick={() => {
                setMostrarMenu(!mostrarMenu);
                openOnly(mostrarMenu ? null : "menu");
              }}
              variant="navbar"
              className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent ${
                (currentTheme === "light" ? "!text-texto" : "!text-texto",
                mostrarMenu ? "!text-acento !scale-110" : "")
              }`}
              icon={loading ? undefined : IconDots}
              iconSize={22}
              iconAlwaysVisible={!loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-texto/30 border-t-acento rounded-full animate-spin"></div>
                  <span className="text-xs mt-1 font-medium">Cargando</span>
                </>
              ) : (
                <span className="text-xs mt-1 font-medium">Más</span>
              )}
            </MainButton>

            {/* More Menu Dropdown */}
            {mostrarMenu && !loading && (
              <>
                {/* Overlay para cerrar el dropdown en móvil */}
                <div
                  className="fixed inset-0 z-40 lg:hidden"
                  onClick={() => setMostrarMenu(false)}
                />
                <div
                  className={`absolute bottom-full right-2 mb-2 w-56 max-w-[calc(100vw-1rem)] rounded-lg shadow-lg z-50 p-2 ${
                    currentTheme === "light"
                      ? "bg-fondo border border-texto/15 text-texto"
                      : "bg-fondo text-texto border border-texto/15"
                  }`}
                >
                  {/* Cambiar tema usando MainButton */}
                  <MainButton
                    onClick={() => {
                      toggleTheme();
                      setMostrarMenu(false);
                    }}
                    variant="navbar"
                    className={`w-full !justify-start !px-4 !py-3 !rounded-lg ${
                      currentTheme === "light" ? " !text-texto" : " !text-texto"
                    }`}
                    icon={currentTheme === "light" ? IconSun : IconMoon}
                    iconSize={20}
                  >
                    <span>Cambiar tema</span>
                  </MainButton>

                  {usuario && (
                    <>
                      {/* Perfil*/}
                      <MainLinkButton
                        to="/cuenta"
                        onClick={() => setMostrarMenu(false)}
                        variant="navbar"
                        className={`w-full !justify-start !px-4 !py-3 !rounded-lg ${
                          isActive("/cuenta") ? "!text-acento" : ""
                        }`}
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={getUserDisplayName()}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-acento/10 flex items-center justify-center text-xs font-medium text-acento">
                            {getUserInitial()}
                          </div>
                        )}
                        <span className="ml-2 truncate">
                          {getUserDisplayName()}
                        </span>
                      </MainLinkButton>

                      {/* Cerrar sesión*/}
                      <MainButton
                        onClick={async () => {
                          await logoutUser();
                          setMostrarMenu(false);
                        }}
                        variant="danger"
                        className={`w-full !justify-start !px-4 !py-3 !rounded-none !border-none ${
                          currentTheme === "light"
                            ? "!bg-transparent !text-red-600"
                            : "!bg-transparent !text-red-400"
                        }`}
                        icon={IconLogout}
                        iconSize={20}
                      >
                        <span>Cerrar sesión</span>
                      </MainButton>
                    </>
                  )}

                  {!usuario && (
                    /* Login */
                    <MainLinkButton
                      to="/login"
                      onClick={() => setMostrarMenu(false)}
                      variant="accent"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none !border-none ${
                        currentTheme === "light"
                          ? "!bg-transparent !text-orange-600"
                          : "!bg-transparent !text-acento"
                      }`}
                    >
                      <span>Iniciar sesión</span>
                    </MainLinkButton>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Padding para prevenir el contenido overlap */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default MobileBottomNav;
