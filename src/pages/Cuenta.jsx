import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../context/RoleContext";
import { getPerfil } from "../services/perfil/getPerfil";
import { useAlerta } from "../context/AlertaContext";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import MainH3 from "../components/ui/MainH3";
import MainLinkButton from "../components/ui/MainLinkButton";
import MainLoader from "../components/ui/MainLoader";
import { IconUser, IconLoader2 } from "@tabler/icons-react";

const Cuenta = () => {
  const { usuario } = useAuth();
  const { loadingRole } = useRole();
  const location = useLocation();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    document.title = "Red-Fi | Mi Perfil";
  }, []);

  useEffect(() => {
    if (location.state?.alerta) {
      const { tipo, mensaje } = location.state.alerta;
      tipo === "exito" ? mostrarExito(mensaje) : mostrarError(mensaje);
    }
  }, [location.state]);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (error) {
        mostrarError("No se pudo cargar el perfil de usuario.");
      } finally {
        setLoading(false);
      }
    };

    if (usuario) cargarPerfil();
  }, [usuario, mostrarError]);

  if (!usuario) {
    return (
      <p className="text-center mt-10 text-texto">No has iniciado sesión.</p>
    );
  }

  if (loading || loadingRole) {
    return <MainLoader texto="Cargando perfil..." size="large" />;
  }

  const nombre = perfil?.nombre || "Usuario";
  const foto = perfil?.foto_url || usuario?.user_metadata?.foto_perfil;
  const iniciales = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconUser}>Mi cuenta</MainH1>
          <p className="text-lg">
            Modifica tus datos personales y tus preferencias.
          </p>
        </div>

        <div className="w-full flex flex-col items-center">
          {foto ? (
            <img
              src={foto}
              alt="Foto de perfil"
              className="size-50 rounded-full object-cover border-4 border-texto/15 mx-auto mb-4 shadow-lg"
            />
          ) : (
            <div className="size-50 rounded-full bg-texto/5 border-4 border-texto/15 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-texto">{iniciales}</span>
            </div>
          )}
          <MainH2 className="text-center justify-center">{nombre}</MainH2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
            <p className="bg-texto/5 px-3 py-1 rounded-full border border-texto/15">
              {usuario.email}
            </p>
            <p className="bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15">
              Usuario <span className="text-acento">{perfil.plan}</span>
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <MainLinkButton
              to="/boletas"
              variant="card"
              isPremium={true}
              tituloPremium="Gestión de boletas"
            >
              <MainH3 className="text-center justify-center">
                Gestionar boletas
              </MainH3>
              <p>
                Administra tus boletas, revisa aumentos y recibe alertas antes
                del vencimiento.
              </p>
            </MainLinkButton>
          </div>

          <div>
            <MainLinkButton
              to="/academia"
              variant="card"
              isPremium={true}
              tituloPremium="Academia Red-Fi"
            >
              <MainH3 className="text-center justify-center">
                Academia Red-Fi
              </MainH3>
              <p>
                Accede a cursos breves y gratuitos sobre redes, Wi-Fi y mejora
                de conexión.
              </p>
            </MainLinkButton>
          </div>

          <div>
            <MainLinkButton to="/resenas" variant="card">
              <MainH3 className="text-center justify-center">
                Mis reseñas
              </MainH3>
              <p>
                Consulta, organiza y administra todas las reseñas que publicaste
                en Red-Fi.
              </p>
            </MainLinkButton>
          </div>

          <div>
            <MainLinkButton to="/editar-perfil" variant="card">
              <MainH3 className="text-center justify-center">
                Editar perfil
              </MainH3>
              <p>
                Actualiza tu foto, nombre y datos personales asociados a tu
                cuenta.
              </p>
            </MainLinkButton>
          </div>

          <div>
            <MainLinkButton to="/planes" variant="card">
              <MainH3 className="text-center justify-center">
                Gestionar plan
              </MainH3>
              <p>Consulta tu plan actual y explora beneficios disponibles.</p>
            </MainLinkButton>
          </div>

          <div>
            <MainLinkButton
              to="/glosario"
              variant="card"
              isPremium={true}
              tituloPremium="Glosario de redes"
            >
              <MainH3 className="text-center justify-center">
                Glosario de redes
              </MainH3>
              <p>
                Busca definiciones rápidas de términos como IP, ping, latencia y
                más.
              </p>
            </MainLinkButton>
          </div>
        </div>

        {perfil.rol === "admin" && (
          <div className="max-w-7xl mx-auto mt-8 w-full">
            <MainLinkButton to="/admin" variant="cardAdmin">
              <MainH3 className="text-center justify-center">
                Gestionar Red-Fi
              </MainH3>
              <p>
                Panel administrativo para gestionar usuarios, proveedores y
                reseñas.
              </p>
            </MainLinkButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cuenta;
