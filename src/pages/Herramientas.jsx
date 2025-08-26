import { useEffect } from "react";
import DetectorProveedor from "../components/tools/DetectorProveedor";
import SpeedTest from "../components/tools/SpeedTest";
import WifiScanner from "../components/tools/WifiScanner";
import { IconTool } from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import { useTheme } from "../context/ThemeContext";

const Herramientas = () => {
  useEffect(() => {
    document.title = "Red-Fi | Herramientas";
  }, []);

  const { currentTheme } = useTheme();

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconTool}>Herramientas Red-Fi</MainH1>
          <p className="text-lg">
            Ejecute pruebas clave y obtenga información útil sobre su red
            actual.
          </p>
        </div>

        {/* Contenedor flex o grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Detector de proveedor */}
          <div
            className={`w-full p-8 rounded-lg self-start ${
              currentTheme === "light"
                ? "bg-secundario border border-secundario/50 shadow-lg"
                : "bg-texto/5 border border-texto/15"
            }`}
          >
            <MainH2 className="text-center justify-center">Información de tu red</MainH2>
            <DetectorProveedor />
          </div>
          {/* Test de velocidad */}
          <div
            className={`w-full p-8 rounded-lg ${
              currentTheme === "light"
                ? "bg-secundario border border-secundario/50 shadow-lg"
                : "bg-texto/5 border border-texto/15"
            }`}
          >
            <MainH2 className="text-center justify-center">Test de velocidad</MainH2>
            <SpeedTest />
          </div>
        </div>

        {/* WifiScanner – análisis por zona */}
        <div
          className={`mx-auto max-w-7xl p-8 rounded-lg ${
            currentTheme === "light"
              ? "bg-secundario border border-secundario/50 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
          <div className="w-full text-center">
            <MainH2 className="text-center justify-center">Análisis de conexión por zonas de tu casa</MainH2>
            <div className=" text-texto p-4 rounded leading-relaxed">
              <p>
                Medí la calidad de tu Wi-Fi en distintas zonas de tu casa
                ingresando un nombre (ej: <strong>Living</strong>,{" "}
                <strong>Pieza</strong>, <strong>Balcón</strong>) y ejecutando el
                test.
              </p>
              <p className="mt-2">
                Ideal para encontrar el mejor lugar para ubicar el módem o
                comparar el rendimiento por sector.
              </p>
            </div>
          </div>
          <WifiScanner />
        </div>
      </div>
    </section>
  );
};

export default Herramientas;
