import { supabase } from "../../supabase/client";

export const obtenerReseñas = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase.from("reseñas").select(`
    *,
    user_profiles:usuario_id(nombre, foto_url),
    proveedores (
      *,
      ProveedorTecnologia(tecnologias(*)),
      ZonaProveedor(zonas(*))
    )
  `);

  if (error) {
    mostrarAlerta("Error al obtener reseñas.");
    throw error;
  }
  return data;
};

export const crearReseña = async (reseñaData, mostrarAlerta = () => {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const datosReseña = {
      comentario: reseñaData.comentario,
      estrellas: reseñaData.estrellas,
      proveedor_id: reseñaData.proveedor_id,
      usuario_id: user.id,
      ubicacion: {
        lat: reseñaData.ubicacion.lat,
        lng: reseñaData.ubicacion.lng,
      },
    };

    const { data: reseñaCompleta, error } = await supabase
      .from("reseñas")
      .insert([datosReseña])
      .select(`
        *,
        user_profiles:usuario_id(nombre, foto_url),
        proveedores (
          *,
          ProveedorTecnologia(tecnologias(*)),
          ZonaProveedor(zonas(*))
        )
      `)
      .single();

    if (error) throw error;
    return reseñaCompleta;
  } catch (error) {
    mostrarAlerta(`Error en crear reseña: ${error.message}`);
    throw error;
  }
};
