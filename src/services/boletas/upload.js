import { supabase } from "../../supabase/client";
import { obtenerUsuarioActual } from "./auth";

/**
 * Sube una imagen al bucket de Supabase y devuelve su URL pública.
 * La imagen se guarda dentro de una carpeta con el ID del usuario.
 * @param {File} archivo - Archivo de imagen
 * @returns {Promise<string|null>} URL pública o null si falla
 */
export const subirImagenBoleta = async (archivo) => {
  const user = await obtenerUsuarioActual();
  if (!user) throw new Error("Usuario no autenticado");

  const fileName = `boleta-${Date.now()}-${archivo.name}`;
  const path = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("boletas")
    .upload(path, archivo);

  if (uploadError) throw new Error("Error al subir la imagen.");

  const { data } = supabase.storage.from("boletas").getPublicUrl(path);
  return data.publicUrl;
};

export const eliminarImagenBoleta = async (urlImagen) => {
  if (!urlImagen) return;

  const url = new URL(urlImagen);
  const path = decodeURIComponent(url.pathname.split("/storage/v1/object/public/boletas/")[1]);

  const { error } = await supabase.storage.from("boletas").remove([path]);
  if (error) {
    console.warn("Error al eliminar imagen:", error.message);
  }
};
