import { supabase } from "../../supabase/client";

/**
 * Obtiene todas las preguntas de un quiz por curso ID
 */
export const obtenerQuizPorCurso = async (
  cursoId,
  mostrarAlerta = () => {}
) => {
  try {
    console.log("Buscando quiz para curso ID:", cursoId);
    const { data, error } = await supabase
      .from("quiz_preguntas")
      .select(
        `
        *,
        quiz_opciones(*)
      `
      )
      .eq("curso_id", cursoId);

    console.log("Respuesta obtenerQuizPorCurso - data:", data, "error:", error);

    // Debug: mostrar estructura exacta
    if (data && data.length > 0) {
      console.log("Estructura de la primera pregunta:", data[0]);
      console.log("Opciones de la primera pregunta:", data[0].quiz_opciones);
    }

    if (error) {
      // Si la tabla no existe, devolver array vacío
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn(
          "Tabla 'quiz_preguntas' no existe, devolviendo array vacío"
        );
        return [];
      }
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error al obtener quiz:", error);
    mostrarAlerta("Error al cargar el quiz del curso.");
    // En lugar de lanzar error, devolver array vacío para evitar que se rompa la app
    console.warn(
      "Devolviendo array vacío debido a error en obtenerQuizPorCurso"
    );
    return [];
  }
};

/**
 * Crea o actualiza un quiz completo para un curso
 */
export const guardarQuiz = async (
  cursoId,
  preguntas,
  mostrarAlerta = () => {}
) => {
  try {
    // Iniciar transacción eliminando preguntas existentes
    await eliminarQuizPorCurso(cursoId);

    // Crear nuevas preguntas
    for (const pregunta of preguntas) {
      const { data: nuevaPregunta, error: errorPregunta } = await supabase
        .from("quiz_preguntas")
        .insert([
          {
            curso_id: cursoId,
            pregunta: pregunta.pregunta,
          },
        ])
        .select()
        .single();

      if (errorPregunta) throw errorPregunta;

      // Crear opciones para esta pregunta
      // Manejar ambas estructuras: quiz_opciones (del backend) y opciones (locales)
      const opcionesRaw = pregunta.quiz_opciones || pregunta.opciones || [];
      const opciones = opcionesRaw.map((opcion) => ({
        pregunta_id: nuevaPregunta.id,
        opcion: opcion.texto || opcion.opcion || "",
        es_correcta: opcion.es_correcta,
      }));

      const { error: errorOpciones } = await supabase
        .from("quiz_opciones")
        .insert(opciones);

      if (errorOpciones) throw errorOpciones;
    }

    return true;
  } catch (error) {
    console.error("Error al guardar quiz:", error);
    mostrarAlerta("Error al guardar el quiz.");
    throw new Error("Error al guardar el quiz");
  }
};

/**
 * Elimina todas las preguntas y opciones de un curso
 */
export const eliminarQuizPorCurso = async (
  cursoId,
  mostrarAlerta = () => {}
) => {
  try {
    // Las opciones se eliminan automáticamente por CASCADE
    const { error } = await supabase
      .from("quiz_preguntas")
      .delete()
      .eq("curso_id", cursoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al eliminar quiz:", error);
    mostrarAlerta("Error al eliminar el quiz.");
    throw new Error("Error al eliminar el quiz");
  }
};
