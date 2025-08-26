import { supabase } from "../../supabase/client";

export const obtenerReseñasAdmin = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("reseñas")
    .select("id, estrellas, comentario, user_profiles(nombre), proveedor_id, proveedores(nombre)")
    .order("user_profiles(nombre)", { ascending: true });

  if (error) {
    mostrarAlerta("Error al obtener reseñas para admin.");
    throw error;
  }
  return data;
};

export const actualizarReseñaAdmin = async (id, datos, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("reseñas")
    .update({
      comentario: datos.comentario,
      estrellas: datos.estrellas,
      proveedor_id: datos.proveedor_id,
    })
    .eq("id", id);

  if (error) {
    mostrarAlerta("Error al actualizar reseña como admin");
    throw error;
  }
};

export const eliminarReseñaAdmin = async (id, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("reseñas")
    .delete()
    .eq("id", id);

  if (error) {
    mostrarAlerta("Error al eliminar reseña como admin");
    throw error;
  }
};
