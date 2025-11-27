import { supabase } from "../../supabase/client";

// Obtiene todas las reseñas con datos de usuario y proveedor (vista admin)
export const obtenerReseñasAdmin = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("reseñas")
    .select(
      "id, estrellas, comentario, created_at, usuario_id, user_profiles(nombre, foto_url), proveedor_id, proveedores(id, nombre, logotipo)"
    )
    .order("user_profiles(nombre)", { ascending: true });

  if (error) {
    mostrarAlerta("Error al obtener reseñas para admin.");
    throw error;
  }
  return data;
};

// Actualiza una reseña existente por ID (vista admin)
export const actualizarReseñaAdmin = async (
  id,
  datos,
  mostrarAlerta = () => {}
) => {
  const { error } = await supabase
    .from("reseñas")
    .update({
      comentario: datos.comentario,
      estrellas: datos.estrellas,
      proveedor_id: datos.proveedor_id,
    })
    .eq("id", id);

  if (error) {
    // Detecta si el error es por exceder el límite de caracteres
    if (error.code === "23514") {
      const mensajeError = "No puedes superar el límite de caracteres";
      mostrarAlerta(mensajeError);
      throw new Error(mensajeError);
    }
    mostrarAlerta("Error al actualizar reseña como admin");
    throw error;
  }
};

// Elimina una reseña por ID (vista admin)
export const eliminarReseñaAdmin = async (id, mostrarAlerta = () => {}) => {
  const { error } = await supabase.from("reseñas").delete().eq("id", id);

  if (error) {
    mostrarAlerta("Error al eliminar reseña como admin");
    throw error;
  }
};
