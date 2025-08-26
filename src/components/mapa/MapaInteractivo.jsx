import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import { crearReseña } from "../../services/reseñas/reseñaCrud";
import { BOUNDS_CORRIENTES } from "../../constants/constantes";
import { useMapaInteractivo } from "../../hooks/useMapaInteractivo";
import { useUbicacionActual } from "../../hooks/useUbicacionActual";
import { useSeleccionUbicacion } from "../../hooks/useSeleccionUbicacion";
import { useValidacionUbicacion } from "../../hooks/useValidacionUbicacion";

import ModalProveedor from "../modals/mapa/ModalProveedor";
import ModalReseña from "../modals/mapa/ModalReseña";
import ModalAgregarReseña from "../modals/mapa/ModalAgregarReseña";
import ModalZonaMultiProveedor from "../modals/mapa/ModalZonaMultiProveedor";
import IndicadorSeleccion from "./panel/IndicadorSeleccion";
import MarcadorUbicacion from "./panel/MarcadorUbicacion";

import MainButton from "../ui/MainButton";

import { useAlerta } from "../../context/AlertaContext";

const MapaInteractivo = ({ filtros, onMapRefReady, setCargandoMapa }) => {
  const { mostrarError, mostrarExito } = useAlerta();
  const [modalReseñaAbierto, setModalReseñaAbierto] = useState(false);
  const [modalReseñaCerradaManual, setModalReseñaCerradaManual] = useState(false);
  
  // Estado para modal de zona con múltiples proveedores
  const [modalZonaMultiAbierto, setModalZonaMultiAbierto] = useState(false);
  const [proveedoresZona, setProveedoresZona] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  // Estado para la posición del marcador en pantalla
  const [marcadorPosicion, setMarcadorPosicion] = useState(null);

  const boundsCorrientes = BOUNDS_CORRIENTES;
  const navigate = useNavigate();

  // Hook para validación de ubicación
  const {
    ubicacionActual,
    zonaActual,
    proveedoresDisponibles,
    ubicacionValida,
    validarUbicacion,
    limpiarUbicacion,
  } = useValidacionUbicacion(boundsCorrientes);

  // Función para manejar click en zona con múltiples proveedores
  const handleZonaMultiProveedorClick = (proveedores, zona) => {
    setProveedoresZona(proveedores);
    setZonaSeleccionada(zona);
    setModalZonaMultiAbierto(true);
  };

  const {
    mapContainer,
    mapRef,
    cargandoMapa,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    cargarReseñasIniciales,
  } = useMapaInteractivo(filtros, boundsCorrientes, handleZonaMultiProveedorClick);

  useEffect(() => {
    if (!cargandoMapa && mapRef?.current && onMapRefReady) {
      onMapRefReady(mapRef);
      setCargandoMapa?.(false);
    }
  }, [cargandoMapa, mapRef, onMapRefReady, setCargandoMapa]);

  const {
    modoSeleccion,
    coordenadasSeleccionadas,
    activarSeleccion,
    desactivarSeleccion,
    limpiarSeleccion,
    setCoordenadasSeleccionadas,
  } = useSeleccionUbicacion(mapRef, boundsCorrientes);

  useEffect(() => {
    window.modoSeleccionActivo = modoSeleccion;
    return () => {
      window.modoSeleccionActivo = false;
    };
  }, [modoSeleccion]);

  const { cargandoUbicacion, handleUbicacionActual } = useUbicacionActual(
    boundsCorrientes,
    mapRef
  );

  // Función para convertir coordenadas a posición en pantalla
  const actualizarPosicionMarcador = useCallback(() => {
    if (!mapRef.current || !ubicacionActual) {
      setMarcadorPosicion(null);
      return;
    }

    try {
      const punto = mapRef.current.project([ubicacionActual.lng, ubicacionActual.lat]);
      setMarcadorPosicion({
        x: punto.x,
        y: punto.y,
      });
    } catch (error) {
      console.error("Error al proyectar coordenadas:", error);
      setMarcadorPosicion(null);
    }
  }, [mapRef, ubicacionActual]);

  // Actualizar posición del marcador cuando cambia la ubicación o el mapa
  useEffect(() => {
    actualizarPosicionMarcador();
  }, [actualizarPosicionMarcador]);

  // Actualizar posición cuando el mapa se mueve
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapMove = () => {
      actualizarPosicionMarcador();
    };

    mapRef.current.on('move', handleMapMove);
    mapRef.current.on('zoom', handleMapMove);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('move', handleMapMove);
        mapRef.current.off('zoom', handleMapMove);
      }
    };
  }, [mapRef, actualizarPosicionMarcador]);

  const handleAbrirModalReseña = () => {
    limpiarSeleccion();
    setModalReseñaCerradaManual(false);
    setModalReseñaAbierto(true);
  };

  const handleSeleccionarUbicacion = () => {
    limpiarSeleccion();
    setModalReseñaAbierto(false);
    setModalReseñaCerradaManual(false);
    activarSeleccion();
  };

  // Validar coordenadas cuando se seleccionan desde el mapa
  useEffect(() => {
    if (coordenadasSeleccionadas && !modalReseñaAbierto && !modalReseñaCerradaManual) {
      // Usar una función local para evitar dependencias circulares
      const validarYAbrirModal = async () => {
        const valida = await validarUbicacion(coordenadasSeleccionadas);
        if (valida) {
          setModalReseñaAbierto(true);
        } else {
          // Si la ubicación no es válida, limpiar la selección
          limpiarSeleccion();
        }
      };
      validarYAbrirModal();
    }
  }, [coordenadasSeleccionadas, modalReseñaAbierto, modalReseñaCerradaManual]); // Remover validarUbicacion y limpiarSeleccion

  useEffect(() => {
    const handleAbrirModal = () => {
      handleAbrirModalReseña();
    };

    window.addEventListener("abrirModalAgregarReseña", handleAbrirModal);
    return () => {
      window.removeEventListener("abrirModalAgregarReseña", handleAbrirModal);
    };
  }, []);

  const handleAgregarReseña = async (reseñaData) => {
    try {
      await crearReseña(reseñaData);
      setModalReseñaAbierto(false);
      limpiarSeleccion();
      limpiarUbicacion();
      await cargarReseñasIniciales(filtros);
      mostrarExito("Reseña publicada con éxito.");
    } catch (error) {
      console.error("❌ Error al enviar reseña:", error);
      mostrarError("Ocurrió un error al publicar la reseña.");
    }
  };

  const handleCerrarModal = () => {
    setModalReseñaAbierto(false);
    setModalReseñaCerradaManual(true);
    limpiarSeleccion();
    limpiarUbicacion();
    if (modoSeleccion) {
      desactivarSeleccion();
    }
  };

  return (
    <div className="h-full w-full relative">
      {modoSeleccion && (
        <IndicadorSeleccion onCancelar={desactivarSeleccion} />
      )}

      {/* Marcador de ubicación */}
      {marcadorPosicion && (
        <div
          style={{
            position: 'absolute',
            left: marcadorPosicion.x,
            top: marcadorPosicion.y,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          <MarcadorUbicacion
            coordenadas={ubicacionActual}
            zona={zonaActual}
            esValida={ubicacionValida}
          />
        </div>
      )}

      {/* Mapa en sí */}
      <div
        ref={mapContainer}
        className={`w-full h-full ${modoSeleccion ? "cursor-crosshair" : ""}`}
        style={{
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
        }}
      />

      <ModalProveedor
        proveedor={proveedorActivo}
        onClose={() => setProveedorActivo(null)}
        navigate={navigate}
      />
      <ModalReseña
        reseña={reseñaActiva}
        onClose={() => setReseñaActiva(null)}
      />
      <ModalAgregarReseña
        isOpen={modalReseñaAbierto}
        onClose={handleCerrarModal}
        onEnviar={handleAgregarReseña}
        mapRef={mapRef}
        boundsCorrientes={boundsCorrientes}
        coordenadasSeleccionadas={coordenadasSeleccionadas}
        onSeleccionarUbicacion={handleSeleccionarUbicacion}
      />
      <ModalZonaMultiProveedor
        isOpen={modalZonaMultiAbierto}
        onClose={() => setModalZonaMultiAbierto(false)}
        proveedores={proveedoresZona}
        zonaInfo={zonaSeleccionada}
      />
    </div>
  );
}

export default MapaInteractivo;