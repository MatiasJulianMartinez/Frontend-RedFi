import { useState, useCallback, useRef } from "react";
import { determinarZonaPorCoordenadas, obtenerProveedoresPorZona } from "../services/proveedores/obtenerProveedoresPorZona";
import { obtenerCoordenadasSiEstanEnCorrientes } from "../services/mapa/ubicacion";
import { useAlerta } from "../context/AlertaContext";
import { useDeteccionDispositivo } from "./useDeteccionDispositivo";

export const useValidacionUbicacion = (boundsCorrientes) => {
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [zonaActual, setZonaActual] = useState(null);
  const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);
  const [ubicacionValida, setUbicacionValida] = useState(false);
  
  const { mostrarError, mostrarExito, mostrarInfo } = useAlerta();
  // Usar el hook useDeteccionDispositivo
  const { esMovil } = useDeteccionDispositivo();
  
  // Usar refs para evitar dependencias circulares
  const mostrarErrorRef = useRef(mostrarError);
  const mostrarExitoRef = useRef(mostrarExito);
  const mostrarInfoRef = useRef(mostrarInfo);
  
  // Actualizar refs cuando cambian las funciones
  mostrarErrorRef.current = mostrarError;
  mostrarExitoRef.current = mostrarExito;
  mostrarInfoRef.current = mostrarInfo;

  // Obtener proveedores de una zona específica
  const obtenerProveedoresDeZona = useCallback(async (zonaId) => {
    setCargandoProveedores(true);
    try {
      const proveedores = await obtenerProveedoresPorZona(zonaId, mostrarErrorRef.current);
      setProveedoresDisponibles(proveedores);
    } catch (error) {
      console.error("Error obteniendo proveedores:", error);
      mostrarErrorRef.current("Error al obtener proveedores de la zona.");
      setProveedoresDisponibles([]);
    } finally {
      setCargandoProveedores(false);
    }
  }, []);

  // Validar ubicación y obtener zona
  const validarUbicacion = useCallback(async (coordenadas, suprimirMensaje = false) => {
    if (!coordenadas) {
      setUbicacionValida(false);
      setZonaActual(null);
      setProveedoresDisponibles([]);
      return false;
    }

    setCargandoUbicacion(true);
    try {
      // Determinar en qué zona está la ubicación
      const zona = await determinarZonaPorCoordenadas(
        coordenadas.lat,
        coordenadas.lng,
        mostrarErrorRef.current
      );

      if (!zona) {
        mostrarErrorRef.current("Esta ubicación no está dentro de ninguna zona con cobertura de internet.");
        setUbicacionValida(false);
        setZonaActual(null);
        setProveedoresDisponibles([]);
        return false;
      }

      setZonaActual(zona);
      setUbicacionActual(coordenadas);
      setUbicacionValida(true);
      
      // Obtener proveedores de la zona
      await obtenerProveedoresDeZona(zona.id);
      
      if (!suprimirMensaje) {
        mostrarExitoRef.current(`Ubicación válida en ${zona.departamento}`);
      }
      return true;
    } catch (error) {
      console.error("Error validando ubicación:", error);
      mostrarErrorRef.current("Error al validar la ubicación.");
      setUbicacionValida(false);
      setZonaActual(null);
      setProveedoresDisponibles([]);
      return false;
    } finally {
      setCargandoUbicacion(false);
    }
  }, [obtenerProveedoresDeZona]);

  // Usar ubicación actual del navegador
  /* const usarUbicacionActual = useCallback(async () => {
    setCargandoUbicacion(true);
    try {
      const coordenadas = await obtenerCoordenadasSiEstanEnCorrientes(
        boundsCorrientes,
        mostrarErrorRef.current
      );
      
      if (coordenadas) {
        return await validarUbicacion(coordenadas);
      }
      return false;
    } catch (error) {
      console.error("Error obteniendo ubicación actual:", error);
      mostrarErrorRef.current("Error al obtener tu ubicación actual.");
      return false;
    } finally {
      setCargandoUbicacion(false);
    }
  }, [boundsCorrientes, validarUbicacion]); */

  const usarUbicacionActual = useCallback(async () => {
  // Mostrar alerta diferenciada según dispositivo
  if (!esMovil) {
    // PC: Mostrar advertencia sobre precisión
    mostrarInfoRef.current(
      "En PC, la ubicación puede ser aproximada. Para mayor precisión, usa un dispositivo móvil o selecciona manualmente en el mapa.",
      { duracion: 6000 }
    );
  } else {
    // Mobile: Pedir activar ubicación
    mostrarInfoRef.current(
      "Para una ubicación precisa, asegúrate de tener la geolocalización activada en tu dispositivo.",
      { duracion: 4000 }
    );
  }

  setCargandoUbicacion(true);
  try {
    const coordenadas = await obtenerCoordenadasSiEstanEnCorrientes(
      boundsCorrientes,
      mostrarInfoRef.current,
      esMovil
    );
    
    if (coordenadas) {
      return await validarUbicacion(coordenadas);
    }
    return false;
  } catch (error) {
    console.error("Error obteniendo ubicación actual:", error);
    mostrarErrorRef.current("Error al obtener tu ubicación actual.");
    return false;
  } finally {
    setCargandoUbicacion(false);
  }
}, [boundsCorrientes, validarUbicacion, esMovil]);

  // Limpiar estado
  const limpiarUbicacion = useCallback(() => {
    setUbicacionActual(null);
    setZonaActual(null);
    setProveedoresDisponibles([]);
    setUbicacionValida(false);
  }, []);

  return {
    // Estado
    ubicacionActual,
    zonaActual,
    proveedoresDisponibles,
    cargandoUbicacion,
    cargandoProveedores,
    ubicacionValida,
    
    // Funciones
    validarUbicacion,
    usarUbicacionActual,
    obtenerProveedoresDeZona,
    limpiarUbicacion,
  };
}; 