import { supabase } from "../../supabase/client";
import { getPerfil } from "../../services/perfil/getPerfil";

// Actualizar perfil
export const updatePerfil = async (fields, mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(fields)
    .eq("id", user.id);

  if (error) {
    mostrarAlerta("Error al actualizar el perfil.");
    throw error;
  }
  return data;
};

// Actualizar perfil y foto
export const updatePerfilYFoto = async (
  { nombre, proveedor_preferido, foto, preview, eliminarFoto = false },
  mostrarAlerta = () => {}
) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  // Validación de nombre
  if (!nombre || nombre.trim().length < 2) {
    mostrarAlerta("El nombre debe tener al menos 2 caracteres.");
    throw new Error("El nombre debe tener al menos 2 caracteres.");
  }

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const caracteresInvalidos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/;
  if (emojiRegex.test(nombre) || caracteresInvalidos.test(nombre)) {
    mostrarAlerta("El nombre contiene caracteres no permitidos.");
    throw new Error("El nombre contiene caracteres no permitidos.");
  }

  let nuevaUrl = preview;

  const perfilActual = await getPerfil();
  const urlAntigua = perfilActual.foto_url;
  const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("")
    .data.publicUrl;

  if (eliminarFoto && urlAntigua && urlAntigua.startsWith(bucketUrl)) {
    const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
    await supabase.storage.from("perfiles").remove([rutaAntigua]);
    nuevaUrl = null;
  }

  if (foto) {
    // Validar tipo
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(foto.type)) {
      mostrarAlerta("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
      throw new Error("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
    }

    // Validar tamaño
    const MAX_TAMANO_BYTES = 300 * 1024;
    if (foto.size > MAX_TAMANO_BYTES) {
      mostrarAlerta("La imagen supera los 300 KB permitidos.");
      throw new Error("La imagen supera los 300 KB permitidos.");
    }

    // Validar resolución
    const imagenValida = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 500 || img.height > 500) {
          reject(
            mostrarAlerta("La resolución máxima permitida es 500x500 píxeles."),
            new Error("La resolución máxima permitida es 500x500 píxeles.")
          );
        } else {
          resolve(true);
        }
      };
      img.onerror = () =>
        reject(
          mostrarAlerta("No se pudo procesar la imagen."),
          new Error("No se pudo procesar la imagen.")
        );
      img.src = URL.createObjectURL(foto);
    });

    if (!imagenValida) {
      mostrarAlerta("La imagen no es válida.");
      throw new Error("La imagen no es válida.");
    }

    const urlAntigua = perfilActual.foto_url;
    const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("")
      .data.publicUrl;

    if (urlAntigua && urlAntigua.startsWith(bucketUrl)) {
      const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
      await supabase.storage.from("perfiles").remove([rutaAntigua]);
    }

    // Subir nueva imagen
    const carpetaUsuario = `${user.id}`;
    const nombreArchivo = `perfil-${Date.now()}`;
    const rutaCompleta = `${carpetaUsuario}/${nombreArchivo}`;

    const { error: uploadError } = await supabase.storage
      .from("perfiles")
      .upload(rutaCompleta, foto, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      mostrarAlerta("Error al subir la imagen al servidor.");
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("perfiles")
      .getPublicUrl(rutaCompleta);
    nuevaUrl = data.publicUrl;
  }

  // Actualizar metadata en auth
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      name: nombre,
      foto_perfil: nuevaUrl,
    },
  });
  if (authError) {
    mostrarAlerta("Error al actualizar los datos de autenticación.");
    throw authError;
  }

  // Actualizar en tabla personalizada
  const { error: perfilError } = await supabase
    .from("user_profiles")
    .update({
      nombre,
      proveedor_preferido,
      foto_url: nuevaUrl,
    })
    .eq("id", user.id);

  if (perfilError) {
    mostrarAlerta("Error al actualizar los datos en la base de datos.");
    throw perfilError;
  }
};
