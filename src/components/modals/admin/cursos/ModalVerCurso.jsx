import { useState, useEffect } from "react";
import {
  IconX,
  IconExternalLink,
  IconPlayerPlay,
  IconClipboardCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import MainH2 from "../../../ui/MainH2";
import MainH3 from "../../../ui/MainH3";
import MainButton from "../../../ui/MainButton";
import ModalContenedor from "../../../ui/ModalContenedor";
import { useAlerta } from "../../../../context/AlertaContext";
import { obtenerQuizPorCurso } from "../../../../services/cursos";

const ModalVerCurso = ({ curso, onClose }) => {
  const [quiz, setQuiz] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // info, video, quiz
  const [preguntaExpandida, setPreguntaExpandida] = useState(-1); // Índice de la pregunta expandida (-1 = ninguna expandida)
  const { mostrarError } = useAlerta();

  // Cargar quiz del curso
  useEffect(() => {
    const cargarQuiz = async () => {
      if (!curso?.id) return;

      setLoadingQuiz(true);
      try {
        const quizData = await obtenerQuizPorCurso(curso.id);
        setQuiz(quizData);
      } catch (error) {
        mostrarError("Error al cargar el quiz del curso");
      } finally {
        setLoadingQuiz(false);
      }
    };

    cargarQuiz();
  }, [curso?.id, mostrarError]);

  // Función para extraer el ID del video de YouTube
  const extraerIdYoutube = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = extraerIdYoutube(curso?.video_youtube_url);

  if (!curso) {
    return null;
  }

  return (
    <ModalContenedor onClose={onClose} variant="curso">
      {/* Encabezado fijo */}
      <div className="flex justify-between items-center p-6 flex-shrink-0">
        <MainH2 className="mb-0 flex-1 pr-4">Detalle del curso</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Navegación por tabs */}
        <div className="flex border-b border-texto/15 mb-6">
          <MainButton
            onClick={() => setActiveTab("info")}
            variant="toggle-tabs"
            active={activeTab === "info"}
          >
            Información
          </MainButton>
          <MainButton
            onClick={() => setActiveTab("video")}
            variant="toggle-tabs"
            active={activeTab === "video"}
          >
            Video
          </MainButton>
          <MainButton
            onClick={() => setActiveTab("quiz")}
            variant="toggle-tabs"
            active={activeTab === "quiz"}
          >
            Quiz
          </MainButton>
        </div>

        {/* Contenido según tab activo */}
        <div className="space-y-2 md:space-y-4">
          {activeTab === "info" && (
            <>
              {/* Miniatura y datos básicos */}
              <div className="space-y-4">
                {/* Título */}
                <div>
                  <MainH3
                    className="font-medium text-sm text-texto/75 uppercase tracking-wide mb-2"
                    variant="noflex"
                  >
                    Título
                  </MainH3>
                  <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
                    <p className="text-texto leading-relaxed">{curso.titulo}</p>
                  </div>
                </div>

                {/* Miniatura centrada */}
                {curso.miniatura_url && (
                  <div className="flex justify-center">
                    <img
                      src={curso.miniatura_url}
                      alt={curso.titulo}
                      className="w-64 h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <MainH3
                    className="font-medium text-sm text-texto/75 uppercase tracking-wide mb-2"
                    variant="noflex"
                  >
                    Descripción
                  </MainH3>
                  <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
                    <p className="text-texto leading-relaxed">
                      {curso.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "video" && (
            <div className="space-y-4">
              {videoId ? (
                <>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={curso.titulo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-texto/75">
                    <span>Video incrustado desde YouTube</span>
                    <MainButton
                      as="a"
                      href={curso.video_youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      iconSize={16}
                    >
                      <IconExternalLink />
                      Ver en YouTube
                    </MainButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <IconPlayerPlay
                    size={48}
                    className="mx-auto text-texto/75 mb-4"
                  />
                  <p className="text-texto/75 mb-4">
                    No se pudo cargar el video
                  </p>
                  <MainButton
                    as="a"
                    href={curso.video_youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    iconSize={16}
                  >
                    <IconExternalLink />
                    Ver en YouTube
                  </MainButton>
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-2 md:space-y-4">
              {loadingQuiz ? (
                <div className="text-center py-8">
                  <p className="text-texto/75">Cargando quiz...</p>
                </div>
              ) : quiz.length === 0 ? (
                <div className="text-center py-8">
                  <IconClipboardCheck
                    size={48}
                    className="mx-auto text-texto/75 mb-4"
                  />
                  <p className="text-texto/75">
                    Este curso no tiene quiz configurado
                  </p>
                </div>
              ) : (
                <>
                  {/* Lista de preguntas en acordeón con scroll */}
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                    {quiz.map((pregunta, index) => {
                      const estaExpandida = preguntaExpandida === index;
                      const opciones =
                        pregunta.quiz_opciones || pregunta.opciones || [];
                      const opcionCorrecta = opciones.find(
                        (op) => op.es_correcta
                      );

                      return (
                        <div
                          key={pregunta.id || index}
                          className="border border-texto/15 rounded-lg overflow-hidden"
                        >
                        {/* Header del acordeón */}
                        <div
                          className="flex justify-between items-center p-2 cursor-pointer bg-texto/5 transition-colors"
                          onClick={() =>
                            setPreguntaExpandida(estaExpandida ? -1 : index)
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-acento text-[#1a1a1a] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold">
                                Pregunta {index + 1}
                              </span>
                            </div>

                            {/* Preview del contenido cuando está colapsado */}
                            {!estaExpandida && (
                              <span className="text-sm text-texto/75 truncate max-w-[200px] md:max-w-[300px]">
                                {pregunta.pregunta}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <IconChevronDown
                              size={20}
                              className={`text-texto/75 transition-transform ${
                                estaExpandida ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Contenido expandible */}
                        {estaExpandida && (
                          <div className="p-4 space-y-4 border-t border-texto/10">
                            <div className="mb-4">
                              <p className="font-medium text-lg text-texto">
                                {pregunta.pregunta}
                              </p>
                            </div>

                            <div className="space-y-2">
                              {opciones.map((opcion, opcionIndex) => (
                                <div
                                  key={opcion.id || opcionIndex}
                                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                                    opcion.es_correcta
                                      ? "border-green-700/50 bg-green-700/20"
                                      : "border-texto/10 bg-texto/5"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      opcion.es_correcta
                                        ? "border-green-700 bg-green-700"
                                        : "border-texto/30"
                                    }`}
                                  >
                                    {opcion.es_correcta && (
                                      <div className="w-2 h-2 rounded-full" />
                                    )}
                                  </div>
                                  <span
                                    className={
                                      opcion.es_correcta
                                        ? "font-medium"
                                        : "text-texto/75"
                                    }
                                  >
                                    {opcion.opcion || opcion.texto}
                                  </span>
                                  {opcion.es_correcta && (
                                    <span className="ml-auto text-xs font-bold text-texto/75 whitespace-nowrap">
                                      ✓ Correcta
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botón de cierre fijo */}
      <div className="flex justify-center p-6 flex-shrink-0">
        <MainButton
          variant="primary"
          className="w-full flex-1"
          onClick={onClose}
        >
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerCurso;
