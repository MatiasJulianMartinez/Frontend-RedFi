import { useEffect, useState } from "react";
import {
  IconX,
  IconCircleXFilled,
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";
import MainButton from "./MainButton";
import { DURACION_ALERTA } from "../../constants/constantes";

// Estilos CSS para cada tipo de alerta
const estilos = {
  error: "text-texto border-red-500",
  exito: "text-texto  border-green-500",
  info: "text-texto  border-blue-500",
  advertencia: "text-texto  border-yellow-500",
};

// Iconos correspondientes a cada tipo de alerta
const iconos = {
  error: IconCircleXFilled,
  exito: IconCircleCheck,
  info: IconInfoCircle,
  advertencia: IconAlertTriangle,
};

// Colores para los iconos según el tipo de alerta
const coloresIconos = {
  error: "text-red-500",
  exito: "text-green-500",
  info: "text-blue-500",
  advertencia: "text-yellow-500",
};

// Títulos para cada tipo de alerta
const titulos = {
  error: "Error",
  exito: "Éxito",
  info: "Información",
  advertencia: "Advertencia",
};

const Alerta = ({
  mensaje,
  tipo = "error",
  onCerrar,
  autoOcultar = true,
  duracion = DURACION_ALERTA,
  flotante = false,
}) => {
  // Estados para controlar la visibilidad y animaciones
  const [visible, setVisible] = useState(false);
  const [renderizar, setRenderizar] = useState(false);

  // Maneja la lógica de mostrar/ocultar con animaciones y auto-ocultado
  useEffect(() => {
    if (mensaje) {
      // Inicia el proceso de renderizado y animación
      setRenderizar(true);
      setTimeout(() => setVisible(true), 100); // Pequeño delay para animación suave

      if (autoOcultar) {
        // Configura timer para auto-ocultar la alerta
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            setRenderizar(false);
            onCerrar?.();
          }, 300); // Tiempo para completar animación de salida
        }, duracion);
        return () => clearTimeout(timer);
      }
    }
  }, [mensaje, autoOcultar, duracion, onCerrar]);

  // Cierra la alerta manualmente con animación
  const cerrarAlerta = () => {
    setVisible(false);
    setTimeout(() => {
      setRenderizar(false);
      onCerrar?.();
    }, 300); // Tiempo para completar animación de salida
  };

  // No renderiza nada si no debe mostrarse
  if (!renderizar) return null;

  // Selecciona el icono según el tipo de alerta
  const Icono = iconos[tipo] || iconos.error;

  // Detectar si el mensaje contiene HTML (específicamente etiquetas permitidas como <strong>)
  const contieneHTML = /<(strong|b|em|i|u)>/i.test(mensaje);

  return (
    <div
      className={`
      ${
        flotante
          ? "fixed bottom-6 right-6 z-[10001] w-[calc(100%-3rem)] max-w-md"
          : "relative"
      }
      bg-fondo px-4 py-3 pr-12 rounded-lg border-3 transition-all duration-300 transform
      ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      ${estilos[tipo] || estilos.error}
    `}
    >
      {/* Contenido principal de la alerta con icono, título y mensaje */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <Icono size={20} className={coloresIconos[tipo] || coloresIconos.error} />
          <div className="font-bold">
            {titulos[tipo] || titulos.error}
          </div>
        </div>
        {contieneHTML ? (
          <div className="ml-8" dangerouslySetInnerHTML={{ __html: mensaje }} />
        ) : (
          <div className="ml-8">{mensaje}</div>
        )}
      </div>

      {/* Botón para cerrar la alerta manualmente */}
      <MainButton
        onClick={cerrarAlerta}
        type="button"
        variant="cross"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 z-10"
      >
        <IconX size={18} />
      </MainButton>
    </div>
  );
};

export default Alerta;
