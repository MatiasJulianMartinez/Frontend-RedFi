import MainH2 from "../ui/MainH2";
import MainH3 from "../ui/MainH3";
import MainLinkButton from "../ui/MainLinkButton";
import { useTheme } from "../../context/ThemeContext";

const preguntas = [
  {
    titulo: "¿Red-Fi cobra por el servicio?",
    contenido:
      "No. Red-Fi es totalmente gratuito. Sin embargo, algunas funciones avanzadas como la carga y gestión de boletas, historial completo o navegación sin anuncios están disponibles solo para usuarios con cuenta Premium.",
  },
  {
    titulo: "¿Quiénes pueden dejar opiniones?",
    contenido:
      "Cualquier usuario registrado puede dejar una reseña sobre su experiencia con un proveedor de internet.",
  },
  {
    titulo: "¿Cómo se validan las opiniones de usuarios?",
    contenido:
      "Las reseñas provienen exclusivamente de usuarios registrados. Si una reseña contiene insultos o fue escrita con mala intención, será eliminada.",
  },
  {
    titulo: "¿Qué tipo de proveedores aparecen?",
    contenido:
      "Aparecen tanto grandes empresas como ISPs locales que operan en Corrientes. Tú decides cuál te conviene más.",
  },
  {
    titulo: "¿Qué puedo hacer con las boletas?",
    contenido:
      "Puedes guardarlas para recibir notificaciones antes del vencimiento y ver si hubo aumentos en el monto mes a mes.",
  },
  {
    titulo: "¿Necesito habilitar la ubicación?",
    contenido:
      "No es obligatorio. También puedes buscar proveedores escribiendo manualmente tu zona.",
  },
];

const PreguntasFrecuentes = () => {
  const { currentTheme } = useTheme();
  return (
    <section
      className={`py-16 px-4 sm:px-6 text-texto ${
        currentTheme === "light"
          ? "bg-secundario border-2 border-texto/15"
          : "bg-texto/5"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <MainH2 className="text-center justify-center mb-8">
          Preguntas frecuentes
        </MainH2>

        <div className="grid gap-16 sm:grid-cols-2">
          {preguntas.map((item, i) => (
            <div key={i} className="space-y-2">
              <MainH3 className="text-acento">{item.titulo}</MainH3>
              <p className="leading-relaxed">
                {item.titulo.includes("Red-Fi cobra") ? (
                  <>
                    No. Red-Fi es totalmente gratuito. Sin embargo, algunas
                    funciones avanzadas como la carga y gestión de boletas,
                    historial completo o navegación sin anuncios están
                    disponibles solo para usuarios con cuenta{" "}
                    <MainLinkButton to="/planes" variant="inline">
                      Premium
                    </MainLinkButton>
                    .
                  </>
                ) : (
                  item.contenido
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreguntasFrecuentes;
