import { supabase } from "../../supabase/client";

// subirLogoProveedor
export const subirLogoProveedor = async (nombreProveedor, file) => {
  const slugify = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  const safeNombre = slugify(nombreProveedor);
  const path = `${safeNombre}/logo.png`;

  console.log("📤 Subiendo logo en ruta:", path);
  console.log("📄 Archivo recibido:", file);

  const { error: uploadError } = await supabase.storage
    .from("proveedores")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file?.type || "image/png",
    });

  if (uploadError) {
    console.error("❌ Error al subir logo:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from("proveedores").getPublicUrl(path);
  return data.publicUrl;
};

// Eliminar logo de proveedor desde el bucket
export const eliminarLogoProveedor = async (nombreProveedor) => {
  const slugify = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  const safeNombre = slugify(nombreProveedor);
  const path = `${safeNombre}/logo.png`;

  const { error } = await supabase.storage.from("proveedores").remove([path]);
  if (error) {
    console.error("❌ Error al eliminar el logo:", error);
    throw error;
  }
};
