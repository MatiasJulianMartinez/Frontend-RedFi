import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import maplibregl from "maplibre-gl";
import ModalContenedor from "../../../ui/ModalContenedor";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import { BOUNDS_CORRIENTES } from "../../../../constants/constantes";

const ModalMapa = ({ zona, onClose }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!zona || !mapContainer.current) return;

    // Crear mapa
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
      center: [-58.78, -27.4825],
      zoom: 10,
      maxBounds: [
        [BOUNDS_CORRIENTES.west, BOUNDS_CORRIENTES.south],
        [BOUNDS_CORRIENTES.east, BOUNDS_CORRIENTES.north],
      ],
      attributionControl: false,
    });

    map.current.on("load", () => {
      renderizarZonaEnMapa();
      setCargando(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [zona]);

  const renderizarZonaEnMapa = () => {
    if (!map.current || !zona.geom) return;

    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: zona.geom,
          properties: {
            nombre: zona.departamento,
            id: zona.id,
          },
        },
      ],
    };

    // Agregar fuente de datos
    map.current.addSource("zona-source", {
      type: "geojson",
      data: geojson,
    });

    // Agregar capa de relleno
    map.current.addLayer({
      id: "zona-fill",
      type: "fill",
      source: "zona-source",
      paint: {
        "fill-color": "#0047d6", // primario
        "fill-opacity": 0.2,
      },
    });

    // Agregar capa de borde
    map.current.addLayer({
      id: "zona-outline",
      type: "line",
      source: "zona-source",
      paint: {
        "line-color": "#fb8531", // acento
        "line-width": 2,
        "line-opacity": 0.9,
      },
    });

    // Ajustar vista al polígono
    const coordinates = zona.geom.coordinates[0];
    const bounds = coordinates.reduce(
      (bounds, coord) => bounds.extend(coord),
      new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
    );

    map.current.fitBounds(bounds, {
      padding: 40,
      maxZoom: 15,
    });
  };

  if (!zona) return null;

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Mapa de la zona</MainH2>
        <MainButton
          type="button"
          onClick={onClose}
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Información de la zona */}
      <div className="bg-texto/5 rounded-lg p-3 mb-4 text-sm">
        <span className="font-medium text-texto/75">Departamento:</span>
        <span className="ml-2">{zona.departamento}</span>
      </div>

      {/* Contenedor del mapa */}
      <div className="relative mb-8">
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg overflow-hidden bg-texto/5"
        />

        {cargando && (
          <div className="absolute inset-0 bg-[#1f2a40] flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-texto/15 border-t-acento rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-white">
                Cargando mapa...
              </span>
            </div>
          </div>
        )}

        {!zona.geom && (
          <div className="absolute inset-0 bg-texto/5 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-texto/75">
                No hay datos geográficos para esta zona
              </p>
              <p className="text-xs text-texto/75 mt-1">
                Los datos GeoJSON no están disponibles
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón de cierre */}
      <div className="flex justify-center">
        <MainButton
          variant="primary"
          className="w-full flex-1"
          onClick={onClose}
        >
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalMapa;
