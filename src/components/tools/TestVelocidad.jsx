import { useState, useEffect } from "react";
import { IconArrowLeft, IconGauge } from "@tabler/icons-react";
import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import { useTheme } from "../../context/ThemeContext";
import { useAlerta } from "../../context/AlertaContext";
import { ejecutarSpeedtest } from "../../services/speedtestService";

/**
 * Página de Test de Velocidad
 *
 * Permite medir la velocidad de conexión mostrando medidores circulares en tiempo real.
 */
const TestVelocidad = () => {
  const { currentTheme } = useTheme();
  const { mostrarError, mostrarExito } = useAlerta();
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);
  // Estado para el progreso visual de cada métrica
  const [progreso, setProgreso] = useState({ descarga: 0, subida: 0, latencia: 0 });
  // IP pública y ubicación, obtenidas al inicio del test
  const [infoUsuario, setInfoUsuario] = useState({ ip: null, location: null });

  const iniciarTest = async () => {
    setLoading(true);
    setResultados(null);
    setProgreso({ descarga: 0, subida: 0, latencia: 0 });
    setInfoUsuario({ ip: null, location: null });

    // Obtener IP y ubicación de inmediato
    (async () => {
      try {
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();
        const loc =
          data.city && data.region && data.country
            ? `${data.city}, ${data.region}, ${data.country}`
            : data.city || data.region || data.country || null;
        setInfoUsuario({ ip: data.ip || null, location: loc });
      } catch {
        setInfoUsuario({ ip: null, location: null });
      }
    })();

    try {
      const data = await ejecutarSpeedtest();
      setResultados(data);
      mostrarExito("Test de velocidad completado");
    } catch (err) {
      mostrarError(err.message || "Error al ejecutar test de velocidad");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    if (value == null || isNaN(value)) return "?";
    return Number(value).toFixed(2);
  };

  // Animación de los medidores: incrementos pequeños y frecuentes hasta 99 %
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgreso((prev) => {
          const incrementar = (valor) => {
            if (valor >= 99) return valor;
            const remaining = 99 - valor;
            const delta = remaining * 0.03 + 0.2;
            return Math.min(valor + delta, 99);
          };
          return {
            descarga: incrementar(prev.descarga),
            subida: incrementar(prev.subida),
            latencia: incrementar(prev.latencia),
          };
        });
      }, 100);
    } else {
      setProgreso({ descarga: 100, subida: 100, latencia: 100 });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  // Componente para dibujar el medidor circular
  const RadialGauge = ({ label, value, unit, progress }) => {
    const mostrarValor =
      resultados && !loading ? `${formatNumber(value)} ${unit}` : `${Math.round(progress)}%`;
    const backgroundRing =
      currentTheme === "light" ? "var(--color-secundario)" : "rgba(255,255,255,0.1)";
      const ringColor =
  resultados && !loading ? "var(--color-acento)" : "var(--color-primario)";
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32 sm:h-40 sm:w-40">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${ringColor} ${progress}%, ${backgroundRing} 0)`,
              transform: "rotate(-90deg)",
            }}
          ></div>
          <div
            className="absolute inset-4 rounded-full flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor:
                currentTheme === "light" ? "var(--color-fondo)" : "rgba(0,0,0,0.5)",
            }}
          >
            <span className="text-xl font-bold sm:text-2xl">{mostrarValor}</span>
          </div>
        </div>
        <p className="mt-2 font-medium">{label}</p>
      </div>
    );
  };

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Título y descripción */}
        <div className="text-center mb-8">
          <MainH1 icon={IconGauge}>Test de velocidad</MainH1>
          <p className="text-lg">Medí la velocidad de tu conexión a internet en tiempo real.</p>
        </div>

        {/* Botón para iniciar el test */}
        <div className="flex justify-center">
          <MainButton
            onClick={iniciarTest}
            variant="primary"
            disabled={loading}
            className="px-6 py-3"
          >
            {loading ? "Midiendo..." : "Iniciar test"}
          </MainButton>
        </div>

        {/* IP pública y ubicación (mostradas en cuanto se obtienen) */}
        {(infoUsuario.ip || infoUsuario.location) && (
          <div className="pt-4 text-center space-y-1">
            {infoUsuario.ip && (
              <p className="font-semibold">
                Tu IP pública: <span className="font-normal">{infoUsuario.ip}</span>
              </p>
            )}
            {infoUsuario.location && (
              <p className="font-semibold">
                Ubicación:{" "}
                <span className="font-normal">
                  {infoUsuario.location}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Medidores radiales */}
        {(loading || resultados) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 justify-items-center">
            <RadialGauge
              label="Descarga"
              value={resultados?.downloadSpeed}
              unit="Mbps"
              progress={progreso.descarga}
            />
            <RadialGauge
              label="Subida"
              value={resultados?.uploadSpeed}
              unit="Mbps"
              progress={progreso.subida}
            />
            <RadialGauge
              label="Latencia"
              value={resultados?.latency}
              unit="ms"
              progress={progreso.latencia}
            />
          </div>
        )}

        

        {/* Botón para volver a herramientas */}
        <div className="text-center">
          <MainLinkButton to="/herramientas" variant="secondary">
            <IconArrowLeft />
            Volver a herramientas
          </MainLinkButton>
        </div>
      </div>
    </section>
  );
};

export default TestVelocidad;
