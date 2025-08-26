import { manejarUbicacionActual, eliminarMarcadorUbicacion } from "../services/mapa";
import { useAlerta } from "../context/AlertaContext";
import { useState } from "react";

export const useUbicacionActual = (boundsCorrientes, mapRef) => {
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [marcadorVisible, setMarcadorVisible] = useState(false);
  const { mostrarInfo, mostrarError } = useAlerta();

  const handleUbicacionActual = async () => {
    if (!mapRef.current) {
      mostrarError("El mapa aún no está disponible.");
      return;
    }

    setCargandoUbicacion(true);
    try {
      await manejarUbicacionActual(boundsCorrientes, mostrarInfo, mapRef.current);
      setMarcadorVisible(true);
    } catch (e) {
      mostrarError("Ocurrió un error al obtener tu ubicación.");
    } finally {
      setTimeout(() => setCargandoUbicacion(false), 1000);
    }
  };

  const eliminarMarcador = () => {
    if (mapRef.current) {
      eliminarMarcadorUbicacion(mapRef.current);
      setMarcadorVisible(false);
    }
  };

  return {
    cargandoUbicacion,
    marcadorVisible,
    handleUbicacionActual,
    eliminarMarcador,
  };
};

