import { useState, useRef, useEffect } from "react";
import { IconMessageChatbot, IconX, IconArrowBack } from "@tabler/icons-react";
import MainH1 from "../../components/ui/MainH1";
import MainH2 from "../../components/ui/MainH2";
import MainH3 from "../../components/ui/MainH3";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import { useTheme } from "../../context/ThemeContext";
import { flujoCompleto } from "../../data/chatSoporte";

const Soporte = () => {
  useEffect(() => {
    document.title = "Red-Fi | Soporte";
  }, []);

  const { currentTheme } = useTheme();
  const [chatAbierto, setChatAbierto] = useState(false);

  const [mensajes, setMensajes] = useState([
    { autor: "bot", texto: flujoCompleto.inicio.mensaje },
  ]);
  const [opciones, setOpciones] = useState(flujoCompleto.inicio.opciones);
  const [escribiendo, setEscribiendo] = useState(false);
  const chatRef = useRef(null);

  const manejarSeleccion = (opcion) => {
    setMensajes((prev) => [...prev, { autor: "user", texto: opcion.texto }]);
    setOpciones(null); // Ocultar botones temporalmente
    setEscribiendo(true);

    setTimeout(() => {
      if (opcion.siguiente) {
        const siguientePaso = flujoCompleto[opcion.siguiente];
        setMensajes((prev) => [
          ...prev,
          { autor: "bot", texto: siguientePaso.mensaje },
        ]);
        setOpciones(siguientePaso.opciones);
      } else if (opcion.respuesta) {
        setMensajes((prev) => [
          ...prev,
          { autor: "bot", texto: opcion.respuesta },
        ]);
        // Opciones contextuales más útiles
        setOpciones([
          { texto: "Volver al menú principal", siguiente: "inicio" },
          { texto: "Información sobre Red-Fi", siguiente: "informacion" },
          { texto: "Problemas de conexión", siguiente: "problemas_conexion" },
          { texto: "Ayuda técnica", siguiente: "ayuda_tecnica" },
        ]);
      }
      setEscribiendo(false);
    }, 800); // Tiempo de espera simulado
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajes, escribiendo]);

  return (
    <>
      {/* Contenido principal de soporte */}
      <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center mb-8">
            <MainH1 icon={IconMessageChatbot}>Centro de soporte</MainH1>
            <p className="text-lg">
              Encuentra ayuda o chatea con nuestro asistente virtual.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sección de ayuda rápida */}
            <div
              className={`p-6 rounded-lg ${
                currentTheme === "light"
                  ? "bg-secundario border-2 border-texto/15 shadow-lg"
                  : "bg-texto/5 border border-texto/15"
              }`}
            >
              <MainH2 className="mb-4">Información rápida</MainH2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>¿Qué es Red-Fi?</MainH3>
                  <p className="text-sm text-texto">
                    Una plataforma comunitaria que te ayuda a elegir el mejor
                    proveedor de Internet basándose en reseñas reales de
                    usuarios.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>Herramientas principales</MainH3>
                  <p className="text-sm text-texto">
                    Mapa de cobertura con reseñas por zona, test de velocidad y
                    comparador de proveedores basado en experiencias reales.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>¿Cómo funciona?</MainH3>
                  <p className="text-sm text-texto">
                    Los usuarios escriben reseñas honestas sobre sus
                    proveedores, clasificadas por zonas geográficas para
                    ayudarte a decidir.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>Completamente gratuito</MainH3>
                  <p className="text-sm text-texto">
                    Consulta reseñas, usa el mapa de cobertura y realiza tests
                    de velocidad sin costo alguno.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de problemas comunes */}
            <div
              className={`p-6 rounded-lg ${
                currentTheme === "light"
                  ? "bg-secundario border-2 border-texto/15 shadow-lg"
                  : "bg-texto/5 border border-texto/15"
              }`}
            >
              <MainH2 className="mb-4">Soluciones técnicas comunes</MainH2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>Internet muy lento</MainH3>
                  <p className="text-sm text-texto">
                    Realiza un test de velocidad, reinicia el router, usa cable
                    ethernet y verifica si otros usuarios reportan problemas
                    similares en tu zona.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>Problemas de WiFi</MainH3>
                  <p className="text-sm text-texto">
                    Ubica el router en lugar central y alto, cambia a banda 5GHz
                    si está disponible y evita interferencias de
                    electrodomésticos.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>Elegir nuevo proveedor</MainH3>
                  <p className="text-sm text-texto">
                    Consulta nuestro mapa, lee reseñas de tu zona específica y
                    compara velocidades reales reportadas por otros usuarios.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-texto/15">
                  <MainH3>Problemas gaming/streaming</MainH3>
                  <p className="text-sm text-texto">
                    Usa conexión por cable, cierra aplicaciones innecesarias y
                    verifica que tu ping sea menor a 50ms en nuestro test.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4">¿Necesitas más ayuda personalizada?</p>
            <MainButton
              onClick={() => setChatAbierto(true)}
              variant="primary"
              className="px-6 py-4"
              icon={IconMessageChatbot}
            >
              Abrir Chat de Soporte
            </MainButton>
          </div>
          {/* Botón para volver a herramientas */}
          <div className="text-center">
            <MainLinkButton to="/herramientas" variant="secondary">
              <IconArrowBack />
              Volver a herramientas
            </MainLinkButton>
          </div>
        </div>
      </section>

      {/* Botón flotante del chat */}
      {!chatAbierto && (
        <div className="fixed bottom-24 lg:bottom-6 right-6 z-40">
          <MainButton
            onClick={() => setChatAbierto(true)}
            variant="primary"
            className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 p-4"
            aria-label="Abrir chat de soporte"
          >
            <IconMessageChatbot size={28} />
          </MainButton>
        </div>
      )}

      {/* Ventana del chat flotante */}
      {chatAbierto && (
        <div className="fixed bottom-24 lg:bottom-6 right-4 left-4 sm:right-6 sm:left-auto sm:w-96 lg:w-120 z-50">
          <div
            className={`rounded-lg shadow-2xl overflow-hidden ${
              currentTheme === "light"
                ? "bg-secundario border-2 border-texto/15"
                : "bg-fondo border border-texto/15"
            }`}
          >
            {/* Header del chat */}
            <div
              className={`px-4 py-3 flex items-center justify-between ${
                currentTheme === "light"
                  ? "bg-primario text-white"
                  : "bg-primario text-texto"
              }`}
            >
              <div className="flex items-center space-x-2">
                <IconMessageChatbot size={20} />
                <span className="font-bold">Asistente Red-Fi</span>
              </div>
              <MainButton
                onClick={() => setChatAbierto(false)}
                variant="cross"
                title="Cerrar chat"
                className="px-0 text-white"
              >
                <IconX size={24} />
              </MainButton>
            </div>

            {/* Cuerpo del chat */}
            <div className="h-100 lg:h-140 flex flex-col">
              <div
                ref={chatRef}
                className="flex-1 overflow-y-auto space-y-3 p-3"
              >
                {mensajes.map((m, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      m.autor === "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-[85%] text-sm ${
                        m.autor === "bot"
                          ? currentTheme === "light"
                            ? "bg-texto/5 text-texto text-left border-2 border-texto/15"
                            : "bg-texto/5 text-texto text-left"
                          : currentTheme === "light"
                          ? "bg-primario text-white text-right border-2 border-texto/15"
                          : "bg-primario text-texto text-right"
                      }`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {m.texto}
                    </div>
                  </div>
                ))}

                {escribiendo && (
                  <div className="flex justify-start">
                    <div
                      className={`p-2 rounded-lg text-sm animate-pulse ${
                        currentTheme === "light"
                          ? "bg-texto/5 text-texto border-2 border-texto/15"
                          : "bg-texto/5 text-texto"
                      }`}
                    >
                      Escribiendo...
                    </div>
                  </div>
                )}
              </div>

              {/* Opciones del chat */}
              {opciones && (
                <div className="p-3 border-t border-texto/15">
                  <div className="grid grid-cols-2 gap-2">
                    {opciones.map((op, index) => (
                      <MainButton
                        key={index}
                        onClick={() => manejarSeleccion(op)}
                        disabled={escribiendo}
                        variant={
                          op.texto === "Volver al menú principal" || op.texto === "Volver a ayuda técnica" || op.texto === "Volver a problemas de conexión"
                            ? "secondary"
                            : "primary"
                        }
                        className="text-sm text-left justify-start"
                      >
                        {op.texto}
                      </MainButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Soporte;
