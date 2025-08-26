import { supabase } from "../../supabase/client";

// Crear perfil inicial tras el registro
export const crearPerfil = async ({ nombre, proveedor_preferido }, mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    nombre,
    proveedor_preferido: proveedor_preferido || null,
  });

  if (error) {
    mostrarAlerta("Error al crear el perfil.");
    throw error;
  }
};