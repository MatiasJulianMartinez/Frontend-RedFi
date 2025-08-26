import { supabase } from "../../supabase/client";

// Obtener perfil extendido del usuario logueado
export const getPerfil = async (mostrarAlerta = () => {}) => {
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
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    mostrarAlerta("Error al obtener el perfil.");
    throw error;
  }
  return data;
};

export const obtenerPerfilPorId = async (id, mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      `
      id,
      nombre,
      foto_url,
      proveedor_preferido,
      rol,
      plan,
      reseñas (
        id,
        comentario,
        estrellas,
        created_at,
        proveedor_id (
          id,
          nombre
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    mostrarAlerta("Error al obtener el perfil del usuario");
    throw error;
  }

  return data;
};
