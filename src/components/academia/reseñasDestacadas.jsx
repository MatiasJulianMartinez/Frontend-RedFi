import { IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import MainH2 from "../ui/MainH2";

const reseñas = [
  {
    nombre: "Ethan Carter",
    comentario:
      "¡Los cursos de la Academia de Red-Fi son excelentes! Me ayudaron a entender mi red y aplicar mejoras reales en casa.",
    estrellas: 5,
    imagen: "/imgs/avatars/academia/ethan.jpg",
  },
  {
    nombre: "Sofía Benítez",
    comentario:
      "Pude estudiar a mi ritmo y aplicar todo en mi trabajo como técnica de soporte. Súper claro y útil.",
    estrellas: 4,
    imagen: "/imgs/avatars/academia/sofia.jpg",
  },
  {
    nombre: "Lucas Herrera",
    comentario:
      "El curso de ciberseguridad fue muy completo. Me dio herramientas clave para arrancar en redes.",
    estrellas: 5,
    imagen: "/imgs/avatars/academia/lucas.jpg",
  },
];

const ReseñasDestacadas = () => {
  const { currentTheme } = useTheme();
  return (
    <section className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <MainH2 className="text-center justify-center">
          Historias de estudiantes
        </MainH2>
        <p className="text-lg">Revisa las historias de nuestros estudiantes</p>
      </div>
      <div className="max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {reseñas.map((r, i) => (
            <div
              key={i}
              className={`flex flex-col items-center backdrop-blur-md p-6 rounded-lg text-center transition-transform transform hover:scale-105 ${
                currentTheme === "light"
                  ? "bg-secundario border-2 border-texto/15 shadow-lg"
                  : "bg-texto/5 border border-texto/15"
              }`}
            >
              <img
                src={r.imagen}
                alt={r.nombre}
                className="w-24 h-24 rounded-full object-cover border border-texto/15 mb-3"
              />
              <p className="text-acento font-bold mb-2">{r.nombre}</p>

              <p className="text-texto mb-4 text-left">{r.comentario}</p>

              <div className="flex gap-1 text-yellow-600 justify-center mb-4 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15">
                {Array.from({ length: 5 }, (_, idx) =>
                  idx < r.estrellas ? (
                    <IconCarambolaFilled size={14} key={idx} />
                  ) : (
                    <IconCarambola size={14} key={idx} />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReseñasDestacadas;
