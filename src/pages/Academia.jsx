import { useEffect, useState } from "react";
import {
  IconBook2,
  IconArrowBack,
  IconSchool,
  IconCalendarWeek,
  IconTools,
  IconExclamationCircle,
} from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import MainH3 from "../components/ui/MainH3";
import MainLinkButton from "../components/ui/MainLinkButton";
import MainLoader from "../components/ui/MainLoader";
import ReseñasDestacadas from "../components/academia/reseñasDestacadas";
import { useTheme } from "../context/ThemeContext";
import { useAlerta } from "../context/AlertaContext";
import { obtenerCursos } from "../services/cursos";

const Academia = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();
  const { mostrarError } = useAlerta();

  useEffect(() => {
    document.title = "Red-Fi | Academia";

    const cargarCursos = async () => {
      console.log("Cargando cursos en Academia...");
      setLoading(true);
      try {
        const cursosData = await obtenerCursos();
        console.log("Cursos obtenidos:", cursosData);
        setCursos(cursosData);
      } catch (error) {
        console.error("Error al cargar cursos en Academia:", error);
        // No mostrar error si simplemente no hay cursos
        setCursos([]);
      } finally {
        setLoading(false);
        console.log("Loading terminado");
      }
    };

    cargarCursos();
  }, []); // Removemos mostrarError de las dependencias para evitar re-renders

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconBook2}>Academia Red-Fi</MainH1>
          <p className="text-lg">
            Aprende a mejorar tu experiencia con internet y redes.
          </p>
        </div>

        <div className="text-center mb-8">
          <MainH2 className="text-center justify-center">
            Accede a nuestros cursos
          </MainH2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-12">
            <MainLoader texto="Cargando cursos..." size="large" />
          </div>
        )}

        {/* Error/Empty state */}
        {!loading && cursos.length === 0 && (
          <div className="text-center py-12 bg-texto/5 border border-texto/10 rounded-lg">
            <IconExclamationCircle
              size={48}
              className="mx-auto text-texto/75 mb-4"
            />
            <MainH3 className="text-center justify-center mb-2">
              No hay cursos disponibles
            </MainH3>
            <p className="text-texto/75">
              Actualmente no hay cursos publicados en la academia.
            </p>
          </div>
        )}

        {/* Cursos list */}
        {!loading && cursos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-0 md:space-y-4 mb-12 max-w-4xl mx-auto">
            {cursos.map((curso) => (
              <MainLinkButton
                to={`/academia/curso/${curso.id}`}
                key={curso.id}
                variant="curso"
                className="h-full p-3 md:p-0"
                isPremium={true}
              >
                {/* Miniatura */}
                <div className="w-full md:w-32 h-32 flex-shrink-0 flex items-center justify-center overflow-hidden pt-3 md:pl-3">
                  {curso.miniatura_url ? (
                    <img
                      src={curso.miniatura_url}
                      alt={curso.titulo}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <IconBook2 size={24} className="text-texto/75" />
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 p-3 flex flex-col justify-center">
                  <MainH3 className="text-center md:text-left justify-center md:justify-start mb-1 md:mb-2 line-clamp-1">
                    {curso.titulo}
                  </MainH3>
                  <p className="line-clamp-1 text-xs md:text-sm text-texto/75 leading-relaxed text-center md:text-left">
                    {curso.descripcion}
                  </p>
                </div>
              </MainLinkButton>
            ))}
          </div>
        )}

        <div className="text-center max-w-2xl mx-auto mt-18 mb-6">
          <MainH2 className="text-center justify-center">
            ¿Por qué elegir la Academia Red-Fi?
          </MainH2>
          <p className="text-lg">
            En la Academia Red-Fi te brindamos formación práctica y de calidad
            para que puedas mejorar tu experiencia con internet y redes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-texto/5 border border-texto/15 shadow-lg p-4 rounded-lg">
            <MainH3 icon={IconSchool} className="text-center justify-center">
              Instructores expertos
            </MainH3>
            <p>
              Aprende con profesionales con experiencia real en la industria.
            </p>
          </div>
          <div className="bg-texto/5 border border-texto/15 shadow-lg p-4 rounded-lg">
            <MainH3
              icon={IconCalendarWeek}
              className="text-center justify-center"
            >
              Aprendizaje flexible
            </MainH3>
            <p>
              Estudia a tu ritmo desde cualquier dispositivo, en cualquier
              momento.
            </p>
          </div>
          <div className="bg-texto/5 border border-texto/15 shadow-lg p-4 rounded-lg">
            <MainH3 icon={IconTools} className="text-center justify-center">
              Contenido práctico
            </MainH3>
            <p>Aplica lo aprendido con ejercicios reales y casos concretos.</p>
          </div>
        </div>

        <div className="mt-8">
          <ReseñasDestacadas />
        </div>

        {/* Botón volver al perfil */}
        <div className="text-center">
          <MainLinkButton to="/cuenta" variant="secondary">
            <IconArrowBack />
            Volver al perfil
          </MainLinkButton>
        </div>
      </div>
    </section>
  );
};

export default Academia;
