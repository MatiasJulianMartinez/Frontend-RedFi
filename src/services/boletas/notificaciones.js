import { supabase } from "../../supabase/client";

export const obtenerNotificacionesBoletas = async (userId) => {
  const { data, error } = await supabase
    .from("boletas")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) return [];

  const ahora = new Date();
  const alertas = [];

  data.forEach((b) => {
    const vencimiento = new Date(b.vencimiento + "T00:00:00");
    const diff = vencimiento - ahora;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (dias >= 0 && dias <= 2) {
      const partes = [];
      if (dias > 0) partes.push(`${dias} día${dias !== 1 ? "s" : ""}`);
      if (horas > 0) partes.push(`${horas} hora${horas !== 1 ? "s" : ""}`);
      if (minutos > 0) partes.push(`${minutos} minuto${minutos !== 1 ? "s" : ""}`);
      alertas.push(`📅 ${b.proveedor} vence en ${partes.join(" y ")}`);
    }
  });

  const ordenadas = [...data].sort(
    (a, b) => new Date(b.vencimiento) - new Date(a.vencimiento)
  );
  if (ordenadas.length >= 2) {
    const actual = parseFloat(ordenadas[0].monto);
    const anterior = parseFloat(ordenadas[1].monto);
    const diferencia = actual - anterior;
    if (diferencia > 0) {
      alertas.push(`⚠️ Subió $${diferencia.toFixed(2)} este mes`);
    }
  }

  return alertas;
};
