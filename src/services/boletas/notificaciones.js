/**
 * Servicio de notificaciones para boletas de servicios de internet
 * Genera alertas automáticas sobre vencimientos próximos y aumentos de precios
 * Analiza las boletas del usuario para crear notificaciones relevantes
 */

import { supabase } from "../../supabase/client";

/** Helpers  */
const aFechaMedianoche = (valor) => {
  if (!valor) return null;
  const tieneHora = typeof valor === "string" && valor.includes("T");
  return new Date(tieneHora ? valor : `${valor}T00:00:00`);
};

const calcularDiferencias = (fechaObjetivo, ahora = new Date()) => {
  const diferenciaMs = fechaObjetivo.getTime() - ahora.getTime();
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  const horas = Math.floor(
    (diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
  return { diferenciaMs, dias, horas, minutos };
};

const formatearTiempoRestante = ({ dias, horas, minutos }) => {
  const partes = [];
  if (dias > 0) partes.push(`${dias} día${dias !== 1 ? "s" : ""}`);
  if (horas > 0) partes.push(`${horas} hora${horas !== 1 ? "s" : ""}`);
  if (minutos > 0) partes.push(`${minutos} minuto${minutos !== 1 ? "s" : ""}`);
  return partes.join(" y ") || "menos de 1 minuto";
};

/**
 * Obtiene notificaciones automáticas basadas en las boletas del usuario
 * Genera alertas por vencimientos próximos (<=7 días), promociones próximas (<=7 días)
 * y aumentos de precio entre boletas recientes
 * Retorna un array de mensajes de notificación (strings)
 */
export const obtenerNotificacionesBoletas = async (userId) => {
  // Traer boletas del usuario
  const { data, error } = await supabase
    .from("boletas")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) return [];

  const ahora = new Date();
  const alertas = [];

  //  1) VENCIMIENTO (7 días o menos)
  data.forEach((b) => {
    const fechaVencimiento = aFechaMedianoche(b.vencimiento);
    if (!fechaVencimiento || isNaN(fechaVencimiento)) return;

    const { dias, horas, minutos, diferenciaMs } = calcularDiferencias(
      fechaVencimiento,
      ahora
    );
    if (diferenciaMs < 0) return; // ya venció

    if (dias >= 0 && dias <= 7) {
      const texto = formatearTiempoRestante({ dias, horas, minutos });
      alertas.push(`📅 ${b.proveedor} vence en ${texto}`);
    }
  });

  //  2) PROMOCIÓN (7 días o menos)
  data.forEach((b) => {
    const fechaPromo = aFechaMedianoche(b.promoHasta ?? b.promo_hasta);
    if (!fechaPromo || isNaN(fechaPromo)) return;

    const { dias, horas, minutos, diferenciaMs } = calcularDiferencias(
      fechaPromo,
      ahora
    );
    if (diferenciaMs < 0) return; // ya venció la promo

    if (dias >= 0 && dias <= 7) {
      const texto = formatearTiempoRestante({ dias, horas, minutos });
      alertas.push(
        `🏷️ La promoción de ${b.proveedor ?? "tu servicio"} vence en ${texto}`
      );
    }
  });

  //  3) AUMENTO DE PRECIO
  const ordenadas = [...data].sort(
    (a, b) => new Date(b.vencimiento) - new Date(a.vencimiento)
  );

  if (ordenadas.length >= 2) {
    const actual = parseFloat(ordenadas[0].monto);
    const anterior = parseFloat(ordenadas[1].monto);
    if (!isNaN(actual) && !isNaN(anterior)) {
      const diferencia = actual - anterior;
      if (diferencia > 0) {
        alertas.push(`⚠️ Subió $${diferencia.toFixed(2)} este mes`);
      }
    }
  }

  return alertas;
};
