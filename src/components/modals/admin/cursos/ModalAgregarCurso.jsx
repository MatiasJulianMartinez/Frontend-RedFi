import { useState } from "react";
import {
  IconX,
  IconCirclePlus,
  IconTrash,
  IconBulb,
  IconChevronDown,
} from "@tabler/icons-react";
import MainH2 from "../../../ui/MainH2";
import MainH3 from "../../../ui/MainH3";
import MainH4 from "../../../ui/MainH4";
import MainButton from "../../../ui/MainButton";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import FileInput from "../../../ui/FileInput";
import RadioButton from "../../../ui/RadioButton";
import Badge from "../../../ui/Badge";
import ModalContenedor from "../../../ui/ModalContenedor";
import { useAlerta } from "../../../../context/AlertaContext";
import {
  crearCurso,
  validarMiniatura,
  validarDimensionesImagen,
  guardarQuiz,
  validarQuiz,
  crearPreguntaVacia,
  validarUrlYoutube,
} from "../../../../services/cursos";

const ModalAgregarCurso = ({ onClose, onActualizar }) => {
  // Estados del formulario principal
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [miniatura, setMiniatura] = useState(null);
  const [previewMiniatura, setPreviewMiniatura] = useState(null);

  // Estados del quiz
  const [preguntas, setPreguntas] = useState([crearPreguntaVacia()]);

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos básicos, 2: Quiz
  const [preguntaExpandida, setPreguntaExpandida] = useState(-1); // Índice de la pregunta expandida (-1 = ninguna expandida)

  const { mostrarError, mostrarExito } = useAlerta();

  // Manejo de archivo de miniatura
  const handleFileChange = async (file) => {
    if (!file) return;

    // Validar archivo
    const fileErrors = validarMiniatura(file);
    if (fileErrors.length > 0) {
      mostrarError(fileErrors.join(", "));
      return;
    }

    // Validar dimensiones
    const dimensionErrors = await validarDimensionesImagen(file);
    if (dimensionErrors.length > 0) {
      mostrarError(dimensionErrors.join(", "));
      return;
    }

    setMiniatura(file);
    setPreviewMiniatura(URL.createObjectURL(file));
  };

  // Manejo de preguntas del quiz
  const agregarPregunta = () => {
    if (preguntas.length < 10) {
      const nuevasPreguntas = [...preguntas, crearPreguntaVacia()];
      setPreguntas(nuevasPreguntas);
      setPreguntaExpandida(nuevasPreguntas.length - 1); // Expandir la nueva pregunta
    }
  };

  const eliminarPregunta = (index) => {
    if (preguntas.length > 1) {
      const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
      setPreguntas(nuevasPreguntas);

      // Ajustar el índice de la pregunta expandida
      if (preguntaExpandida >= index) {
        setPreguntaExpandida(
          preguntaExpandida > 0 ? preguntaExpandida - 1 : -1
        );
      }
      if (preguntaExpandida >= nuevasPreguntas.length) {
        setPreguntaExpandida(
          nuevasPreguntas.length > 0 ? nuevasPreguntas.length - 1 : -1
        );
      }
    }
  };

  const actualizarPregunta = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const actualizarOpcion = (preguntaIndex, opcionIndex, campo, valor) => {
    const nuevasPreguntas = [...preguntas];

    if (campo === "es_correcta" && valor) {
      // Solo una opción puede ser correcta
      nuevasPreguntas[preguntaIndex].opciones.forEach((opcion) => {
        opcion.es_correcta = false;
      });
    }

    nuevasPreguntas[preguntaIndex].opciones[opcionIndex][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  // Validación y envío
  const validarDatosBasicos = () => {
    if (!titulo.trim()) {
      mostrarError("El título es requerido");
      return false;
    }
    if (!descripcion.trim()) {
      mostrarError("La descripción es requerida");
      return false;
    }

    const urlError = validarUrlYoutube(videoUrl);
    if (urlError) {
      mostrarError(urlError);
      return false;
    }

    return true;
  };

  const handleSiguiente = () => {
    if (validarDatosBasicos()) {
      setStep(2);
    }
  };

  // Validar si todas las preguntas están completas
  const validarPreguntasCompletas = () => {
    return preguntas.every((pregunta) => {
      // Verificar que la pregunta esté escrita
      const preguntaCompleta = pregunta.pregunta.trim() !== "";

      // Verificar que las 3 opciones estén completas
      const opcionesCompletas = pregunta.opciones.every(
        (opcion) => opcion.texto.trim() !== ""
      );

      return preguntaCompleta && opcionesCompletas;
    });
  };

  const handleSubmit = async () => {
    if (!validarDatosBasicos()) return;

    // Validar quiz
    const quizErrors = validarQuiz(preguntas);
    if (quizErrors.length > 0) {
      mostrarError(quizErrors.join(", "));
      return;
    }

    setLoading(true);
    try {
      // Crear curso
      const cursoData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        video_youtube_url: videoUrl.trim(),
      };

      const nuevoCurso = await crearCurso(cursoData, miniatura);

      // Guardar quiz
      await guardarQuiz(nuevoCurso.id, preguntas);

      mostrarExito("Curso creado exitosamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      mostrarError(error.message || "Error al crear el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose} variant="curso">
      {/* Encabezado fijo */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Agregar curso</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={loading}
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-2 md:space-y-4 mb-4"
        >
          {step === 1 ? (
            // Paso 1: Datos básicos
            <div>
              {/* Título */}
              <Input
                label={
                  <>
                    Titulo <span className="text-red-600">*</span>
                  </>
                }
                name="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Cómo solucionar problemas de internet"
                required
                maxLength={100}
                showCounter
              />

              {/* Descripción */}
              <Textarea
                label={
                  <>
                    Descripción <span className="text-red-600">*</span>
                  </>
                }
                name="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe de qué trata el curso..."
                required
                maxLength={500}
                showCounter
                rows={4}
              />

              {/* URL de YouTube */}
              <Input
                label={
                  <>
                    URL del video de YouTube{" "}
                    <span className="text-red-600">*</span>
                  </>
                }
                name="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                maxLength={200}
                showCounter
                required
              />

              {/* Miniatura */}
              <FileInput
                label={
                  <>
                    Miniatura del curso <span className="text-red-600">*</span>
                  </>
                }
                accept="image/*"
                onChange={handleFileChange}
                value={miniatura}
                previewUrl={previewMiniatura}
                setPreviewUrl={setPreviewMiniatura}
                disabled={loading}
                hideRemoveButton={true}
              />
            </div>
          ) : (
            // Paso 2: Quiz
            <div className="space-y-2 md:space-y-4">
              {/* Header del quiz - sticky */}
              <div className="sticky top-0 bg-secundario z-10 pb-4 border-b border-texto/10 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <MainH3 className="mb-0">Quiz del curso</MainH3>
                    <Badge variant="accent" size="sm">
                      {preguntas.length}/10 preguntas
                    </Badge>
                  </div>
                  <MainButton
                    type="button"
                    variant="accent"
                    onClick={agregarPregunta}
                    disabled={preguntas.length >= 10}
                    iconSize={16}
                    className="w-full sm:w-auto"
                  >
                    <IconCirclePlus />
                    Agregar pregunta
                  </MainButton>
                </div>
              </div>

              {/* Lista de preguntas con scroll */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {preguntas.map((pregunta, preguntaIndex) => {
                  const estaExpandida = preguntaExpandida === preguntaIndex;
                  const tieneContenido = pregunta.pregunta.trim() !== "";
                  const tieneOpcionesCompletas = pregunta.opciones.some(
                    (op) => op.texto.trim() !== ""
                  );

                  return (
                    <div
                      key={preguntaIndex}
                      className="border border-texto/15 rounded-lg overflow-hidden"
                    >
                      {/* Header del acordeón */}
                      <div
                        className="flex justify-between items-center p-2 cursor-pointer bg-texto/5 transition-colors"
                        onClick={() =>
                          setPreguntaExpandida(
                            estaExpandida ? -1 : preguntaIndex
                          )
                        }
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-bold">
                            Pregunta {preguntaIndex + 1}
                          </span>

                          {/* Preview del contenido cuando está colapsado */}
                          {!estaExpandida && tieneContenido && (
                            <span className="text-sm text-texto/75 truncate max-w-[150px] md:max-w-[200px]">
                              {pregunta.pregunta}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {preguntas.length > 1 && (
                            <MainButton
                              type="button"
                              variant="delete"
                              iconAlwaysVisible={true}
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarPregunta(preguntaIndex);
                              }}
                              title={`Eliminar pregunta ${preguntaIndex + 1}`}
                            ></MainButton>
                          )}

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
                          <Textarea
                            label={
                              <>
                                Pregunta <span className="text-red-600">*</span>
                              </>
                            }
                            value={pregunta.pregunta}
                            onChange={(e) =>
                              actualizarPregunta(
                                preguntaIndex,
                                "pregunta",
                                e.target.value
                              )
                            }
                            placeholder="Escribe la pregunta..."
                            required
                            maxLength={200}
                            showCounter
                            rows={2}
                          />

                          <div className="space-y-2">
                            <MainH4
                              className="text-sm font-medium text-texto mb-3"
                              variant="noflex"
                            >
                              Opciones de respuesta{" "}
                              <span className="text-red-600">*</span>
                            </MainH4>
                            {pregunta.opciones.map((opcion, opcionIndex) => (
                              <div key={opcionIndex} className="w-full">
                                {/* Contenedor principal con radio button al costado del input */}
                                <div className="flex items-start gap-3 w-full">
                                  <div className="flex-shrink-0 pt-2">
                                    <RadioButton
                                      id={`radio_${preguntaIndex}_${opcionIndex}`}
                                      name={`correcta_${preguntaIndex}`}
                                      checked={opcion.es_correcta}
                                      onChange={() =>
                                        actualizarOpcion(
                                          preguntaIndex,
                                          opcionIndex,
                                          "es_correcta",
                                          true
                                        )
                                      }
                                      hideLabel={true}
                                      size="md"
                                      title="Marcar como respuesta correcta"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <Input
                                      placeholder={`Opción ${opcionIndex + 1}`}
                                      value={opcion.texto}
                                      onChange={(e) =>
                                        actualizarOpcion(
                                          preguntaIndex,
                                          opcionIndex,
                                          "texto",
                                          e.target.value
                                        )
                                      }
                                      className="w-full"
                                      required
                                      maxLength={100}
                                      showCounter
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="text-xs text-texto/75 bg-texto/5 p-2 rounded border border-texto/10 flex items-start gap-2">
                              <IconBulb
                                size={14}
                                className="flex-shrink-0 text-acento"
                              />
                              <span>
                                <strong>Tip:</strong> Marca la opción correcta
                                seleccionando el círculo correspondiente
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3">
        {step === 1 ? (
          <>
            <MainButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </MainButton>
            <MainButton
              type="button"
              variant="primary"
              onClick={handleSiguiente}
              className="flex-1"
            >
              Siguiente: Quiz
            </MainButton>
          </>
        ) : (
          <>
            <MainButton
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={loading}
              className="flex-1"
            >
              Anterior
            </MainButton>
            <MainButton
              type="button"
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || !validarPreguntasCompletas()}
              className="flex-1"
            >
              {loading ? "Creando..." : "Crear curso"}
            </MainButton>
          </>
        )}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-texto/75 italic">
          Los campos marcados con <span className="text-red-600">*</span> son
          obligatorios.
        </p>
      </div>
    </ModalContenedor>
  );
};

export default ModalAgregarCurso;
