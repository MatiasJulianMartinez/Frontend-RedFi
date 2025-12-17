import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconArrowBack,
  IconBook2,
  IconPlayerPlay,
  IconClipboardCheck,
  IconExclamationCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import MainH1 from "../../components/ui/MainH1";
import MainH2 from "../../components/ui/MainH2";
import MainH3 from "../../components/ui/MainH3";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import MainLoader from "../../components/ui/MainLoader";
import { useAlerta } from "../../context/AlertaContext";
import { obtenerCursoPorId, obtenerQuizPorCurso } from "../../services/cursos";

const CursoIndividual = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [respuestas, setRespuestas] = useState({});
  const [quizEnviado, setQuizEnviado] = useState(false);
  const [resultadoQuiz, setResultadoQuiz] = useState(null);
  const [quizCargado, setQuizCargado] = useState(false);
  const { mostrarError, mostrarExito } = useAlerta();
  const mostrarErrorRef = useRef(mostrarError);

  // Mantener la referencia actualizada
  useEffect(() => {
    mostrarErrorRef.current = mostrarError;
  }, [mostrarError]);

  useEffect(() => {
    const cargarCurso = async () => {
      if (!id) {
        console.log("No hay ID en la URL, redirigiendo a academia");
        navigate("/academia");
        return;
      }

      console.log("Intentando cargar curso con ID:", id);
      setLoading(true);
      setQuizCargado(false); // Reset del estado del quiz al cambiar de curso
      try {
        // Usar obtenerCursoPorId directamente (sin parseInt porque es UUID)
        const cursoEncontrado = await obtenerCursoPorId(id);
        console.log("Curso encontrado:", cursoEncontrado);

        if (!cursoEncontrado) {
          console.log("Curso no encontrado para ID:", id);
          mostrarErrorRef.current("Curso no encontrado");
          navigate("/academia");
          return;
        }

        setCurso(cursoEncontrado);
        document.title = `Red-Fi | ${cursoEncontrado.titulo}`;
        console.log("Curso cargado exitosamente:", cursoEncontrado.titulo);
      } catch (error) {
        console.error("Error al cargar el curso:", error);
        mostrarErrorRef.current(`Error al cargar el curso: ${error.message}`);
        navigate("/academia");
      } finally {
        setLoading(false);
      }
    };

    cargarCurso();
  }, [id, navigate]); // Quitamos mostrarError de las dependencias

  const cargarQuiz = useCallback(async () => {
    if (!curso?.id || quizCargado) return;

    setLoadingQuiz(true);
    try {
      const quizData = await obtenerQuizPorCurso(curso.id);
      console.log("Quiz cargado en componente:", quizData);
      if (quizData && quizData.length > 0) {
        console.log("Primera pregunta completa:", quizData[0]);
        console.log("Opciones de primera pregunta:", quizData[0].quiz_opciones);
      }
      setQuiz(quizData);
      setQuizCargado(true); // Marcar como cargado
    } catch (error) {
      mostrarErrorRef.current("Error al cargar el quiz");
    } finally {
      setLoadingQuiz(false);
    }
  }, [curso?.id, quizCargado]); // Quitamos mostrarError de las dependencias

  useEffect(() => {
    // Cargar el quiz automáticamente cuando el curso se carga
    if (curso && !quizCargado) {
      cargarQuiz();
    }
  }, [curso, quizCargado, cargarQuiz]);

  const extraerIdYoutube = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const handleRespuesta = (preguntaId, opcionId) => {
    if (quizEnviado) return;

    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcionId,
    }));
  };

  const enviarQuiz = () => {
    if (Object.keys(respuestas).length !== quiz.length) {
      mostrarError("Debes responder todas las preguntas");
      return;
    }
    let correctas = 0;
    const resultados = {};

    quiz.forEach((pregunta) => {
      const respuestaUsuario = respuestas[pregunta.id];
      const opcionCorrecta = pregunta.quiz_opciones?.find(
        (op) => op.es_correcta
      );

      if (opcionCorrecta && respuestaUsuario === opcionCorrecta.id) {
        correctas++;
        resultados[pregunta.id] = {
          correcto: true,
          opcionCorrecta: opcionCorrecta.id,
        };
      } else {
        resultados[pregunta.id] = {
          correcto: false,
          opcionCorrecta: opcionCorrecta?.id,
        };
      }
    });

    const porcentaje = Math.round((correctas / quiz.length) * 100);

    setResultadoQuiz({
      correctas,
      total: quiz.length,
      porcentaje,
      detalles: resultados,
    });

    setQuizEnviado(true);

    if (porcentaje >= 70) {
      mostrarExito(`¡Felicidades! Aprobaste con ${porcentaje}%`);
    } else {
      mostrarError(
        `Necesitas al menos 70% para aprobar. Obtuviste ${porcentaje}%`
      );
    }
  };

  const reiniciarQuiz = () => {
    setRespuestas({});
    setQuizEnviado(false);
    setResultadoQuiz(null);
  };

  if (loading) {
    return (
      <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
        <div className="max-w-4xl mx-auto">
          <MainLoader texto="Cargando curso..." size="large" />
        </div>
      </section>
    );
  }

  if (!curso) {
    return (
      <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
        <div className="max-w-7xl mx-auto text-center">
          <IconExclamationCircle
            size={48}
            className="mx-auto text-texto/75 mb-4"
          />
          <MainH2 className="text-center justify-center mb-4">
            Curso no encontrado
          </MainH2>
          <MainLinkButton to="/academia" variant="primary">
            <IconArrowBack />
            Volver a la Academia
          </MainLinkButton>
        </div>
      </section>
    );
  }

  const videoId = extraerIdYoutube(curso.video_youtube_url);

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <MainH1 icon={IconBook2}>{curso.titulo}</MainH1>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-texto/15">
          <button
            onClick={() => setActiveTab("video")}
            className={`px-6 py-3 border-b-2 transition-colors font-medium ${
              activeTab === "video"
                ? "border-acento text-acento"
                : "border-transparent text-texto/75 hover:text-texto"
            }`}
          >
            <IconPlayerPlay size={20} className="inline mr-2" />
            Video
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-6 py-3 border-b-2 transition-colors font-medium ${
              activeTab === "quiz"
                ? "border-acento text-acento"
                : "border-transparent text-texto/75 hover:text-texto"
            }`}
          >
            <IconClipboardCheck size={20} className="inline mr-2" />
            Quiz ({quiz.length} preguntas)
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === "video" && (
            <div className="space-y-6">
              <div className="bg-texto/5 border border-texto/10 rounded-lg p-6">
                <MainH3 className="mb-3">Sobre este curso</MainH3>
                <p className="text-texto/75 leading-relaxed">
                  {curso.descripcion}
                </p>
              </div>

              {videoId ? (
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={curso.titulo}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-texto/5 border border-texto/15 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <IconExclamationCircle
                      size={48}
                      className="mx-auto text-texto/75 mb-4"
                    />
                    <p className="text-texto/75">Video no disponible</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-6">
              {loadingQuiz ? (
                <div className="py-12">
                  <MainLoader texto="Cargando quiz..." />
                </div>
              ) : quiz.length === 0 ? (
                <div className="text-center py-12 bg-texto/5 border border-texto/10 rounded-lg">
                  <IconClipboardCheck
                    size={48}
                    className="mx-auto text-texto/75 mb-4"
                  />
                  <MainH3 className="text-center justify-center mb-2">
                    Sin quiz disponible
                  </MainH3>
                  <p className="text-texto/75">
                    Este curso no tiene un quiz configurado.
                  </p>
                </div>
              ) : (
                <>
                  {/* Quiz Header */}
                  <div className="bg-acento/10 border border-acento/30 rounded-lg p-6">
                    <MainH3 className="mb-2">Quiz del curso</MainH3>
                    <p className="text-texto/75">
                      Responde las {quiz.length} preguntas para evaluar tus
                      conocimientos. Necesitas al menos 70% para aprobar.
                    </p>
                    {resultadoQuiz && (
                      <div
                        className={`mt-4 p-3 rounded-lg ${
                          resultadoQuiz.porcentaje >= 70
                            ? "bg-green-500/10 border border-green-500/30 text-texto/75"
                            : "bg-red-500/10 border border-red-500/30 text-texto/75"
                        }`}
                      >
                        <p className="font-medium">
                          Resultado: {resultadoQuiz.correctas}/
                          {resultadoQuiz.total} correctas (
                          {resultadoQuiz.porcentaje}%)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Questions */}
                  {quiz.map((pregunta, index) => (
                    <div
                      key={pregunta.id}
                      className="bg-texto/5 border border-texto/10 rounded-lg p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-acento text-[#1a1a1a] w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-4">
                            {pregunta.pregunta}
                          </h4>

                          <div className="space-y-3">
                            {pregunta.quiz_opciones?.map((opcion) => {
                              const isSelected =
                                respuestas[pregunta.id] === opcion.id;
                              const isCorrect = opcion.es_correcta;
                              const showResult = quizEnviado && resultadoQuiz;

                              let buttonClass =
                                "w-full p-4 text-left border rounded-lg transition-colors ";

                              if (showResult) {
                                if (isCorrect) {
                                  buttonClass +=
                                    "border-green-500 bg-green-500/10 text-texto/75";
                                } else if (isSelected && !isCorrect) {
                                  buttonClass +=
                                    "border-red-500 bg-red-500/10 text-texto/75";
                                } else {
                                  buttonClass +=
                                    "border-texto/20 bg-texto/5 text-texto/75";
                                }
                              } else if (isSelected) {
                                buttonClass +=
                                  "border-acento bg-acento/10 text-acento";
                              } else {
                                buttonClass +=
                                  "border-texto/20 hover:border-acento/50 hover:bg-acento/5";
                              }

                              return (
                                <button
                                  key={opcion.id}
                                  onClick={() =>
                                    handleRespuesta(pregunta.id, opcion.id)
                                  }
                                  disabled={quizEnviado}
                                  className={buttonClass}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        showResult && isCorrect
                                          ? "border-green-700 bg-green-700"
                                          : showResult &&
                                            isSelected &&
                                            !isCorrect
                                          ? "border-red-700 bg-red-700"
                                          : isSelected
                                          ? "border-acento bg-acento"
                                          : "border-texto/30"
                                      }`}
                                    >
                                      {showResult && isCorrect && (
                                        <IconCheck
                                          size={12}
                                          className="text-white"
                                        />
                                      )}
                                      {showResult &&
                                        isSelected &&
                                        !isCorrect && (
                                          <IconX
                                            size={12}
                                            className="text-white"
                                          />
                                        )}
                                      {!showResult && isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                      )}
                                    </div>
                                    <span className="flex-1">
                                      {opcion.opcion}
                                    </span>
                                    {showResult && isCorrect && (
                                      <span className="text-texto/75 font-semibold text-sm">
                                        Correcta
                                      </span>
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                      <span className="text-texto/75 font-semibold text-sm">
                                        Incorrecta
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Quiz Actions */}
                  <div className="flex justify-center gap-4">
                    <MainButton
                      onClick={enviarQuiz}
                      variant="primary"
                      disabled={
                        quizEnviado ||
                        Object.keys(respuestas).length !== quiz.length
                      }
                    >
                      Enviar Quiz
                    </MainButton>
                    <MainButton
                      onClick={reiniciarQuiz}
                      variant="secondary"
                      disabled={Object.keys(respuestas).length === 0}
                    >
                      Reiniciar
                    </MainButton>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Botón volver a Academia */}
        <div className="text-center">
          <MainLinkButton to="/academia" variant="secondary">
            <IconArrowBack />
            Volver a la Academia
          </MainLinkButton>
        </div>
      </div>
    </section>
  );
};

export default CursoIndividual;
