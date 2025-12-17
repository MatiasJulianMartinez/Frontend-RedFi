import { useEffect } from "react";
import MainLinkButton from "../../components/ui/MainLinkButton";
import MainH1 from "../../components/ui/MainH1";
import MainH3 from "../../components/ui/MainH3";
import { IconAccessPoint, IconArrowBack } from "@tabler/icons-react";
import WifiScanner from "../../components/tools/WifiScanner";
import { useTheme } from "../../context/ThemeContext";

const AnalisisConexion = () => {
  useEffect(() => {
    document.title = "Red-Fi | Análisis de conexión por zonas";
  });
  const { currentTheme } = useTheme();
  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconAccessPoint}>Análisis de conexión por zonas</MainH1>
          <p className="text-lg">
            En esta herramienta podrás ver la información de tu red, al igual
            que tu ubicación.
          </p>
        </div>
        <div>
          <WifiScanner />
        </div>
        <div
          className={`w-full p-8 rounded-lg max-w-4xl mx-auto ${
            currentTheme === "light"
              ? "bg-secundario border-2 border-texto/15 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
          <MainH3>¿Cómo funciona el análisis de conexión por zonas?</MainH3>
          <p>
            Su funcionalidad es "escanear" la calidad de tu conexión Wi-Fi en
            diferentes zonas de tu hogar. El objetivo es ayudarte a encontrar la
            ubicación óptima para tu router.
          </p>
        </div>
        <div
          className={`w-full p-8 rounded-lg max-w-4xl mx-auto ${
            currentTheme === "light"
              ? "bg-secundario border-2 border-texto/15 shadow-lg"
              : "bg-texto/5 border border-texto/15"
          }`}
        >
          <MainH3>¿Cómo usar el análisis de conexión por zonas?</MainH3>
          <div class="space-y-4">
            <p>
              Para usar el análisis de conexión por zonas, simplemente debes
              ingresar el nombre de la zona que deseas analizar y presionar el
              botón "Analizar". El sistema te mostrará la información de la zona
              que ingresaste.
            </p>
            <p>
              Si realizas el análisis más de 2 veces, se te habilitará el botón
              de "Recomendar ubicación". La funcionalidad del mismo es analizar
              los resultados y te dirá cuál de las zonas medidas tiene la mejor
              calidad de señal (menor ping y jitter combinados).
            </p>
          </div>
        </div>
        {/* Botón volver a herramientas */}
        <div className="text-center">
          <MainLinkButton to="/herramientas" variant="secondary">
            <IconArrowBack />
            Volver a herramientas
          </MainLinkButton>
        </div>
      </div>
    </section>
  );
};

export default AnalisisConexion;
