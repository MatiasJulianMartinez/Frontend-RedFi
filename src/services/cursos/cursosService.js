import { supabase } from "../../supabase/client";
import {
  subirMiniatura,
  actualizarMiniatura,
  eliminarMiniatura,
  eliminarArchivosDelCurso,
} from "./cursoUploadService";

/**
 * Servicio principal para operaciones CRUD de cursos
 */

/**
 * Obtiene todos los cursos disponibles ordenados alfabéticamente por título
 */
export const obtenerCursos = async (mostrarAlerta = () => {}) => {
  try {
    console.log("Iniciando obtenerCursos...");
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .order("titulo", { ascending: true });

    console.log("Respuesta de Supabase - data:", data, "error:", error);

    if (error) {
      // Si la tabla no existe, devolver array vacío en lugar de error
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Tabla 'cursos' no existe, devolviendo array vacío");
        return [];
      }
      mostrarAlerta("Error al obtener los cursos.");
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    mostrarAlerta("Error inesperado al cargar los cursos.");
    // En lugar de lanzar error, devolver array vacío para evitar loops
    console.warn("Devolviendo array vacío debido a error en obtenerCursos");
    return [];
  }
};

/**
 * Obtiene un curso específico por ID
 */
export const obtenerCursoPorId = async (cursoId, mostrarAlerta = () => {}) => {
  try {
    console.log("Buscando curso con ID:", cursoId);
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", cursoId)
      .single();

    console.log("Respuesta obtenerCursoPorId - data:", data, "error:", error);

    if (error) {
      // Si es error de "not found", devolver null en lugar de lanzar error
      if (error.code === "PGRST116" || error.message?.includes("no rows")) {
        console.log("Curso no encontrado con ID:", cursoId);
        return null;
      }
      // Si la tabla no existe, devolver null
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Tabla 'cursos' no existe");
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error al obtener curso:", error);
    mostrarAlerta("Error al cargar el curso.");
    throw new Error("Error al cargar el curso");
  }
};

/**
 * Crea un nuevo curso
 */
export const crearCurso = async (
  cursoData,
  miniaturaFile,
  mostrarAlerta = () => {}
) => {
  try {
    // Validar que se proporcione miniatura (es obligatoria)
    if (!miniaturaFile) {
      throw new Error("La miniatura es obligatoria para crear un curso.");
    }

    // Generar un ID temporal para la carpeta de la miniatura
    const tempId = crypto.randomUUID();

    // Subir miniatura primero usando el ID temporal
    const miniaturaUrl = await subirMiniatura(
      miniaturaFile,
      tempId,
      mostrarAlerta
    );

    // Crear curso con la URL de la miniatura ya disponible
    const { data: nuevoCurso, error } = await supabase
      .from("cursos")
      .insert([
        {
          titulo: cursoData.titulo,
          descripcion: cursoData.descripcion,
          video_youtube_url: cursoData.video_youtube_url,
          miniatura_url: miniaturaUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      // Si falla crear el curso, eliminar la miniatura subida
      try {
        await eliminarMiniatura(miniaturaUrl, mostrarAlerta);
      } catch (cleanupError) {
        console.warn(
          "No se pudo limpiar la miniatura tras error:",
          cleanupError
        );
      }
      
      // Detecta si el error es por exceder el límite de caracteres
      if (error.code === "23514") {
        const mensajeError = "No puedes superar el límite de caracteres";
        mostrarAlerta(mensajeError);
        throw new Error(mensajeError);
      }
      throw error;
    }

    // Si el ID temporal es diferente al ID real del curso, mover la imagen
    if (tempId !== nuevoCurso.id) {
      try {
        // Subir de nuevo con el ID correcto
        const miniaturaUrlCorrecta = await subirMiniatura(
          miniaturaFile,
          nuevoCurso.id,
          mostrarAlerta
        );

        // Eliminar la imagen con ID temporal
        await eliminarMiniatura(miniaturaUrl, mostrarAlerta);

        // Actualizar el curso con la URL correcta
        const { error: updateError } = await supabase
          .from("cursos")
          .update({ miniatura_url: miniaturaUrlCorrecta })
          .eq("id", nuevoCurso.id);

        if (updateError) throw updateError;

        return { ...nuevoCurso, miniatura_url: miniaturaUrlCorrecta };
      } catch (moveError) {
        console.warn(
          "Error al reorganizar miniatura, manteniendo la original:",
          moveError
        );
        // Si falla mover, mantener la imagen original
        return nuevoCurso;
      }
    }

    return nuevoCurso;
  } catch (error) {
    console.error("Error al crear curso:", error);
    mostrarAlerta("Error al crear el curso.");
    throw new Error("Error al crear el curso");
  }
};

/**
 * Actualiza un curso existente
 */
export const actualizarCurso = async (
  cursoId,
  cursoData,
  miniaturaFile,
  miniaturaAnterior = null,
  mostrarAlerta = () => {}
) => {
  try {
    const miniaturaUrl = await actualizarMiniatura(
      miniaturaAnterior,
      miniaturaFile,
      cursoId,
      mostrarAlerta
    );

    // Actualizar curso
    const { data, error } = await supabase
      .from("cursos")
      .update({
        titulo: cursoData.titulo,
        descripcion: cursoData.descripcion,
        video_youtube_url: cursoData.video_youtube_url,
        miniatura_url: miniaturaUrl,
      })
      .eq("id", cursoId)
      .select()
      .single();

    if (error) {
      // Detecta si el error es por exceder el límite de caracteres
      if (error.code === "23514") {
        const mensajeError = "No puedes superar el límite de caracteres";
        mostrarAlerta(mensajeError);
        throw new Error(mensajeError);
      }
      mostrarAlerta("Error al actualizar el curso.");
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    throw error;
  }
};

/**
 * Elimina un curso y sus archivos asociados del storage
 * Siguiendo el patrón robusto de eliminarProveedor
 */
export const eliminarCurso = async (cursoId, mostrarAlerta = () => {}) => {
  try {
    console.log("Iniciando eliminación del curso:", cursoId);

    // 1. Eliminar todos los archivos del curso del storage (toda la carpeta)
    try {
      await eliminarArchivosDelCurso(cursoId, mostrarAlerta);
      console.log("Archivos del curso eliminados del storage");
    } catch (deleteError) {
      console.warn(
        "No se pudieron eliminar los archivos del curso:",
        deleteError
      );
      // No fallar el proceso si no se pueden eliminar los archivos
    }

    // 2. Eliminar el curso de la base de datos
    const { error } = await supabase.from("cursos").delete().eq("id", cursoId);

    if (error) {
      console.error("Error al eliminar curso de la BD:", error);
      throw error;
    }

    console.log("Curso eliminado completamente");
    return true;
  } catch (error) {
    console.error("Error general en eliminación:", error);
    mostrarAlerta("Error al eliminar el curso.");
    throw new Error("Error al eliminar el curso");
  }
};
