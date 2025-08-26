import { useState, useCallback } from "react";
import { buscarUbicacion } from "../services/mapa";
import { eliminarMarcadorUbicacion } from "../services/mapa/ubicacion";
import { useAlerta } from "../context/AlertaContext";

const API_KEY = "195f05dc4c614f52ac0ac882ee570395";

export const useBusquedaUbicacion = (boundsCorrientes, mapRef) => {
  const [input, setInput] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const { mostrarError } = useAlerta();

  // Helpers locales (no toco tu estructura)
  const dentroDeBounds = (lng, lat, b) => {
    if (!b || typeof lng !== "number" || typeof lat !== "number") return false;
    return lng >= b.west && lng <= b.east && lat >= b.south && lat <= b.north;
  };

  const getBoundsParam = (b) =>
    b ? `${b.west},${b.south},${b.east},${b.north}` : undefined;

  const centroCiudad = (b) =>
    b
      ? [(b.west + b.east) / 2, (b.south + b.north) / 2] // [lng,lat]
      : [-58.8341, -27.4698]; // centro aprox. Corrientes

  const buscarSugerencias = useCallback(
    (value) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      setDebounceTimeout(
        setTimeout(() => {
          const v = value.trim();
          if (v.length > 2) {
            const boundsParam = getBoundsParam(boundsCorrientes);
            const [clng, clat] = centroCiudad(boundsCorrientes); // proximity pide lat,lon

            const params = new URLSearchParams({
              q: `${v}, Corrientes Capital, Corrientes, Argentina`,
              key: API_KEY,
              limit: "5",
              no_annotations: "1",
              language: "es",
              countrycode: "ar",
              proximity: `${clat},${clng}`,
            });
            if (boundsParam) params.set("bounds", boundsParam);

            fetch(`https://api.opencagedata.com/geocode/v1/json?${params.toString()}`)
              .then((res) => res.json())
              .then((data) => {
                const results = Array.isArray(data?.results) ? data.results : [];

                // Mostrar SOLO sugerencias dentro de Corrientes Capital
                const dentro = results.filter((r) => {
                  const g = r?.geometry || {};
                  return dentroDeBounds(g.lng, g.lat, boundsCorrientes);
                });

                setSugerencias(dentro);
              })
              .catch((err) => {
                console.error("Error en autocompletar:", err);
                mostrarError("No se pudo obtener sugerencias.");
              });
          } else {
            setSugerencias([]);
          }
        }, 150)
      );
    },
    [debounceTimeout, mostrarError, boundsCorrientes]
  );

  const handleLimpiarBusqueda = () => {
    setInput("");
    setSugerencias([]);
    if (mapRef?.current) {
      eliminarMarcadorUbicacion(mapRef.current);
    }
  };

  // Mantengo tu firma: recibe el value directamente
  const handleInputChange = (value) => {
    setInput(value);
    buscarSugerencias(value);
  };

  const handleBuscar = () => {
    if (mapRef?.current) {
      buscarUbicacion(input, boundsCorrientes, mostrarError, mapRef.current);
    }
  };

  const handleSeleccionarSugerencia = (sugerencia) => {
    setInput(sugerencia.formatted);
    setSugerencias([]);
    if (mapRef?.current) {
      buscarUbicacion(
        sugerencia.formatted,
        boundsCorrientes,
        mostrarError,
        mapRef.current
      );
    }
  };

  return {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
    handleLimpiarBusqueda,
    setSugerencias,
  };
};
