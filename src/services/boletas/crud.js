import { supabase } from "../../supabase/client";
import { obtenerUsuarioActual } from "./auth";
import { subirImagenBoleta, eliminarImagenBoleta } from "./upload";

export const guardarBoleta = async (boleta) => {
  const { error } = await supabase.from("boletas").insert(boleta);
  if (error) throw error;
};

export const eliminarBoletaConImagen = async (boleta) => {
  const { error } = await supabase.from("boletas").delete().eq("id", boleta.id);
  if (error) throw new Error("Error al eliminar la boleta.");

  await eliminarImagenBoleta(boleta.url_imagen);
};

export const actualizarBoletaConImagen = async (
  boleta,
  nuevosDatos,
  nuevaImagen,
  eliminarImagen = false
) => {
  let url_imagen = boleta.url_imagen;

  if (eliminarImagen) {
    await eliminarImagenBoleta(boleta.url_imagen);
    url_imagen = null;
  }

  if (nuevaImagen) {
    if (boleta.url_imagen) await eliminarImagenBoleta(boleta.url_imagen);
    url_imagen = await subirImagenBoleta(nuevaImagen);
  }

  const datosLimpios = {
    ...nuevosDatos,
    url_imagen,
    ...(nuevosDatos.promoHasta && {
      promo_hasta: nuevosDatos.promoHasta,
    }),
  };
  delete datosLimpios.promoHasta;
  delete datosLimpios.proveedorOtro;

  Object.keys(datosLimpios).forEach((key) => {
    if (datosLimpios[key] === undefined) delete datosLimpios[key];
  });

  const { error } = await supabase
    .from("boletas")
    .update(datosLimpios)
    .eq("id", boleta.id);

  if (error) throw new Error("Error al guardar cambios.");
};

export const obtenerBoletasDelUsuario = async () => {
  const user = await obtenerUsuarioActual();
  if (!user) return [];

  const { data, error } = await supabase
    .from("boletas")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha_carga", { ascending: false });

  if (error) {
    console.error("Error al cargar boletas:", error);
    return [];
  }

  return data;
};
