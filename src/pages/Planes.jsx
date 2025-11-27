import { useAuth } from "../context/AuthContext";
import { useRole } from "../context/RoleContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import {
  IconCheck,
  IconReceiptDollar,
  IconArrowBack,
  IconX,
} from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";
import MainLoader from "../components/ui/MainLoader";
import ModalConfirmacionPlan from "../components/modals/plan/ModalConfirmacionPlan";

const beneficiosBasico = [
  { texto: "Acceso al mapa interactivo", disponible: true },
  { texto: "Ver y agregar reseñas", disponible: true },
  { texto: "Acceso a las herramientas", disponible: true },
  { texto: "Acceso completo a la gestión de boletas", disponible: false },
  { texto: "Acceso completo a la Academia Red-Fi", disponible: false },
  { texto: "Sin anuncios ni banners promocionales", disponible: false },
  { texto: "Notificaciones básicas", disponible: false },
];

const beneficiosPremium = [
  { texto: "Acceso al mapa interactivo", disponible: true },
  { texto: "Ver y agregar reseñas", disponible: true },
  { texto: "Acceso a las herramientas", disponible: true },
  { texto: "Acceso completo a la gestión de boletas", disponible: true },
  { texto: "Acceso completo a la Academia Red-Fi", disponible: true },
  { texto: "Sin anuncios ni banners promocionales", disponible: true },
  { texto: "Notificaciones básicas", disponible: true },
];

const Planes = () => {
  const { usuario } = useAuth();
  const { plan, loadingRole } = useRole();
  const { currentTheme } = useTheme();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [planDestino, setPlanDestino] = useState("");

  useEffect(() => {
    document.title = "Red-Fi | Planes";
  }, []);

  const abrirModalCambioPlan = (nuevo) => {
    setPlanDestino(nuevo);
    setMostrarModal(true);
  };

  const renderBeneficios = (lista) => (
    <ul className="text-sm text-texto space-y-2 mb-6 text-left">
      {lista.map((b, i) => (
        <li
          key={i}
          className={`flex items-center ${!b.disponible ? "opacity-75" : ""}`}
        >
          {b.disponible ? (
            <IconCheck
              size={18}
              className="text-acento mr-2"
            />
          ) : (
            <IconX
              size={18}
              className="opacity-75 mr-2"
            />
          )}
          {b.texto}
        </li>
      ))}
    </ul>
  );

  // Si los datos del rol están cargando, mostrar estado de carga
  if (loadingRole) {
    return (
      <section className="py-16 px-4 sm:px-6 text-texto w-full">
        <div className="max-w-7xl mx-auto">
          <MainLoader
            texto="Cargando información de planes..."
            size="large"
            className="py-20"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12 mb-8">
        <div className="text-center mb-8">
          <MainH1 icon={IconReceiptDollar}>Elige tu plan Red-Fi</MainH1>
          <p className="text-lg">
            Compara los planes y selecciona el que mejor se adapte a tus
            necesidades.
          </p>
        </div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Básico */}
          <div
            className={`shadow-lg rounded-lg p-6 flex flex-col justify-between ${
              currentTheme === "light"
                ? "bg-secundario border-2 border-texto/15 shadow-lg"
                : "bg-texto/5 border border-texto/15"
            }`}
          >
            <div>
              <MainH2 className="text-center justify-center">
                Plan Básico
              </MainH2>
              <p className="text-texto mb-4">
                Ideal para usuarios que quieren explorar Red-Fi sin funciones
                avanzadas.
              </p>
              {renderBeneficios(beneficiosBasico)}
            </div>
            {usuario && plan === "basico" ? (
              <MainButton variant="disabled" className="px-4 py-2">
                Este es tu plan actual
              </MainButton>
            ) : (
              <MainButton
                onClick={() => abrirModalCambioPlan("basico")}
                className="px-4 py-2"
              >
                Cambiar a Básico
              </MainButton>
            )}
          </div>

          {/* Plan Premium */}
          <div
            className={`shadow-lg rounded-lg p-6 flex flex-col justify-between ${
              currentTheme === "light"
                ? "bg-secundario border-2 border-texto/15 shadow-lg"
                : "bg-texto/5 border border-texto/15"
            }`}
          >
            <div>
              <MainH2 className="text-acento text-center justify-center">
                Plan Premium
              </MainH2>
              <p className="text-texto mb-4">
                Accede a todos los beneficios de Red-Fi sin límites de uso y sin
                anuncios.
              </p>
              {renderBeneficios(beneficiosPremium)}
            </div>
            {usuario && plan === "premium" ? (
              <MainButton variant="disabled" className="px-4 py-2">
                Este es tu plan actual
              </MainButton>
            ) : (
              <MainButton
                onClick={() => abrirModalCambioPlan("premium")}
                className="px-4 py-2"
              >
                Cambiar a Premium
              </MainButton>
            )}
          </div>
        </div>
      </div>

      {/* Botón volver al perfil */}
      <div className="text-center">
        <MainLinkButton to="/cuenta" variant="secondary">
          <IconArrowBack />
          Volver al perfil
        </MainLinkButton>
      </div>

      {mostrarModal && (
        <ModalConfirmacionPlan
          usuarioId={usuario.id}
          nuevoPlan={planDestino}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </section>
  );
};

export default Planes;
