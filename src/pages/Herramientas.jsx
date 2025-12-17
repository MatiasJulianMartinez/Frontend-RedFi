import { useEffect } from "react";
import MainLinkButton from "../components/ui/MainLinkButton";
import MainH1 from "../components/ui/MainH1";
import MainH3 from "../components/ui/MainH3";
import { IconTool } from "@tabler/icons-react";

const Herramientas = () => {
  useEffect(() => {
    document.title = "Red-Fi | Herramientas";
  }, []);
  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconTool}>Herramientas Red-Fi</MainH1>
          <p className="text-lg">
            Herramientas para evaluar, comparar y gestionar tu conexión a internet.
          </p>
        </div>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <MainLinkButton to="/mapa" variant="card">
              <MainH3 className="text-center justify-center">
                Mapa de Red-Fi
              </MainH3>
              <p>
                Explora proveedores por zona y comparte tu experiencia.
              </p>
            </MainLinkButton>
          </div>
          <div>
            <MainLinkButton to="/informacion-red" variant="card">
              <MainH3 className="text-center justify-center">
                Información de red
              </MainH3>
              <p>
                Consulta tu IP pública, ubicación y datos técnicos de tu conexión.
              </p>
            </MainLinkButton>
          </div>
          <div>
            <MainLinkButton to="/test-velocidad" variant="card">
              <MainH3 className="text-center justify-center">
                Test de velocidad
              </MainH3>
              <p>
                Mide la velocidad real de tu conexión a Internet en segundos.
              </p>
            </MainLinkButton>
          </div>
          <div>
            <MainLinkButton to="/analisis-conexion" variant="card">
              <MainH3 className="text-center justify-center">
                Análisis de conexión por zonas
              </MainH3>
              <p>
                Analiza la calidad Wi-Fi en diferentes zonas de tu hogar.
              </p>
            </MainLinkButton>
          </div>
          <div className="lg:col-span-2">
            <MainLinkButton to="/soporte" variant="card">
              <MainH3 className="text-center justify-center">Soporte</MainH3>
              <p>
                Resuelve problemas de conexión con nuestro chatbot de soporte.
              </p>
            </MainLinkButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herramientas;
