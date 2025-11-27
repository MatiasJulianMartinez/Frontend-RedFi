import { IconMap2 } from "@tabler/icons-react";
import MainH1 from "../ui/MainH1";
import MainLinkButton from "../ui/MainLinkButton";
import { useTheme } from "../../context/ThemeContext";

const HeroSection = () => {
  const { currentTheme } = useTheme();

  // Selecciona la imagen según el tema
  const heroImage =
    currentTheme === "light"
      ? "/imgs/hero-placeholder1.png"
      : "/imgs/hero-placeholder2.png";

  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 py-28 bg-secundario">
      {/* Patrón decorativo en el fondo */}
      <div
        className="absolute inset-0 bg-[url('/imgs/diagonal-lines.svg')] opacity-10 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12">
        {/* Texto a la izquierda */}
        <div className="flex-1 text-center lg:text-left">
          <MainH1
            variant="noflex"
            className="font-bold text-5xl lg:text-6xl leading-tight text-center lg:text-left"
          >
            Encuentra el <span className="text-acento">mejor internet</span>{" "}
            para tu zona.
          </MainH1>
          <p className="mt-6 text-lg">
            Visualiza qué empresas operan cerca tuyo, conoce la experiencia de
            otros usuarios y toma decisiones con confianza.
          </p>
          <MainLinkButton
            to="/mapa"
            className="mt-8 hover:scale-105"
            icon={IconMap2}
            loading={false}
            variant="primary"
          >
            Ver mapa
          </MainLinkButton>
        </div>

        {/* Imagen del mapa */}
        <div className="flex-1 hidden md:flex justify-end ">
          <img
            src={heroImage}
            alt="Mapa Red-Fi"
            className="w-auto max-h-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
