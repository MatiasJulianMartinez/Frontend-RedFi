import { supabase } from "../../supabase/client";

/**
 * Servicio para manejo de archivos y uploads de cursos
 */

/**
 * Sube una miniatura al storage de Supabase organizándola por curso ID
 */
export const subirMiniatura = async (
  miniaturaFile,
  cursoId,
  mostrarAlerta = () => {}
) => {
  try {
    const fileExt = miniaturaFile.name.split(".").pop();
    const fileName = `miniatura-${Date.now()}.${fileExt}`;
    // Organizar archivos en carpeta del curso para mejor organización
    const filePath = `${cursoId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("cursos")
      .upload(filePath, miniaturaFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("cursos").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error al subir miniatura:", error);
    mostrarAlerta("Error al subir la miniatura.");
    throw new Error("Error al subir la miniatura");
  }
};

/**
 * Elimina una miniatura del storage usando la nueva estructura de carpetas
 */
export const eliminarMiniatura = async (
  miniaturaUrl,
  mostrarAlerta = () => {}
) => {
  try {
    if (!miniaturaUrl) return true;

    // Extraer el path de la URL - nueva estructura: cursoId/filename
    const url = new URL(miniaturaUrl);
    // Decodificar la ruta removiendo el prefijo del storage público
    const pathSegments = url.pathname.split("/");
    const cursosIndex = pathSegments.findIndex(
      (segment) => segment === "cursos"
    );

    if (cursosIndex === -1) {
      throw new Error("URL de miniatura inválida");
    }

    // El path será algo como: "curso-id/miniatura-123456.jpg"
    const filePath = pathSegments.slice(cursosIndex + 1).join("/");

    const { error } = await supabase.storage.from("cursos").remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al eliminar miniatura:", error);
    mostrarAlerta("Error al eliminar la miniatura anterior.");
    // No lanzar error aquí para no bloquear otras operaciones
    return false;
  }
};

/**
 * Elimina todos los archivos de un curso (borra toda la carpeta del curso)
 * Siguiendo el patrón de eliminarLogoProveedor
 */
export const eliminarArchivosDelCurso = async (
  cursoId,
  mostrarAlerta = () => {}
) => {
  try {
    console.log("Listando archivos del curso:", cursoId);

    // Listar todos los archivos en la carpeta del curso
    const { data: files, error: listError } = await supabase.storage
      .from("cursos")
      .list(cursoId.toString());

    if (listError) {
      console.error("Error al listar archivos del curso:", listError);
      throw listError;
    }

    // Si hay archivos, eliminarlos todos
    if (files && files.length > 0) {
      const filesToDelete = files.map((file) => `${cursoId}/${file.name}`);

      console.log("Eliminando archivos:", filesToDelete);

      const { error } = await supabase.storage
        .from("cursos")
        .remove(filesToDelete);

      if (error) {
        console.error("Error al eliminar archivos del curso:", error);
        throw error;
      }

      console.log("Archivos del curso eliminados:", filesToDelete);
    } else {
      console.log(
        "ℹNo se encontraron archivos para eliminar en el curso:",
        cursoId
      );
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar archivos del curso:", error);
    mostrarAlerta("Error al eliminar los archivos del curso.");
    // No lanzar error aquí para no bloquear la eliminación del registro
    return false;
  }
};

/**
 * Actualiza la miniatura siguiendo el patrón de proveedores:
 * 1. Subir nueva imagen PRIMERO
 * 2. Eliminar imagen anterior DESPUÉS del éxito
 */
export const actualizarMiniatura = async (
  miniaturaAnterior,
  nuevaMiniatura,
  cursoId,
  mostrarAlerta = () => {}
) => {
  try {
    let nuevaUrl = null;

    // 1. Subir nueva miniatura PRIMERO
    if (nuevaMiniatura) {
      nuevaUrl = await subirMiniatura(nuevaMiniatura, cursoId, mostrarAlerta);

      // 2. Eliminar miniatura anterior DESPUÉS del éxito (si existe y es diferente)
      if (miniaturaAnterior && miniaturaAnterior !== nuevaUrl) {
        try {
          console.log("Eliminando miniatura anterior:", miniaturaAnterior);
          await eliminarMiniatura(miniaturaAnterior, mostrarAlerta);
          console.log("Miniatura anterior eliminada");
        } catch (deleteError) {
          console.warn("No se pudo eliminar miniatura anterior:", deleteError);
          // No fallar el proceso si no se puede eliminar la anterior
        }
      }
    }

    return nuevaUrl || miniaturaAnterior;
  } catch (error) {
    console.error("Error al actualizar miniatura:", error);
    mostrarAlerta("Error al actualizar la miniatura.");
    throw new Error("Error al actualizar la miniatura");
  }
};
