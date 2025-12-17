// src/pages/Usuarios.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerPerfilPorId } from "../services/perfil/getPerfil";
import {
  IconCarambola,
  IconCarambolaFilled,
  IconArrowBack,
} from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import MainLinkButton from "../components/ui/MainLinkButton";
import Avatar from "../components/ui/Avatar";
import MainLoader from "../components/ui/MainLoader";

const Usuarios = () => {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const data = await obtenerPerfilPorId(id);
      setPerfil(data);
    };
    fetchPerfil();
  }, [id]);

  if (!perfil) {
    return (
      <div className="text-center text-texto mt-20">
        <MainLoader texto="Cargando perfil..." size="large" />
      </div>
    );
  }

  const { nombre, foto_url, proveedor_preferido, rol, plan, reseñas } = perfil;

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12 mb-8">
        {/* Info del usuario */}
        <div className="bg-texto/5 border border-texto/15 rounded-2xl p-6 mb-10 shadow-lg text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <Avatar fotoUrl={foto_url} nombre={nombre} size={35} />
          </div>

          {/* Nombre */}
          <MainH1>{nombre}</MainH1>

          {/* Proveedor preferido */}
          <p className="text-texto mt-2">
            Proveedor preferido:{" "}
            <span className="font-bold text-texto">
              {proveedor_preferido || "No especificado"}
            </span>
          </p>

          {/* Rol y Plan */}
          <div className="flex justify-center gap-3 mt-4">
            <span className="bg-texto/5 text-sm px-3 py-1 rounded-full border border-texto/15">
              Rol: <span className="font-semibold text-acento">{rol}</span>
            </span>
            <span className="bg-texto/5 text-sm px-3 py-1 rounded-full border border-texto/15">
              Plan: <span className="font-semibold text-acento">{plan}</span>
            </span>
          </div>
        </div>

        {/* Reseñas del usuario */}
        <div>
          <MainH2 className="text-center justify-center">
            Reseñas publicadas
          </MainH2>

          {reseñas && reseñas.length > 0 ? (
            <div className="space-y-6">
              {reseñas.map((r) => {
                const proveedorNombre =
                  r.proveedor_id?.nombre || "Proveedor desconocido";
                const proveedorLogo = r.proveedor_id?.logotipo || null;

                const fecha = r.created_at
                  ? new Date(r.created_at).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha desconocida";

                return (
                  <div
                    key={r.id}
                    className="bg-texto/5 border border-texto/15 p-5 rounded-xl flex flex-col gap-3"
                  >
                    {/* Proveedor + estrellas */}
                    <div className="flex flex-row sm:flex-row self-auto sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          fotoUrl={proveedorLogo}
                          nombre={proveedorNombre}
                          size={10}
                          className="rounded-full border border-acento"
                        />
                        <div>
                          <MainLinkButton
                            to={`/proveedores/${r.proveedor_id?.id}`}
                            variant="link"
                          >
                            {proveedorNombre}
                          </MainLinkButton>
                          <p className="text-xs text-texto/75">{fecha}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 text-yellow-600 pl-2 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15 self-center sm:self-auto">
                        {Array.from({ length: 5 }, (_, i) =>
                          i < r.estrellas ? (
                            <IconCarambolaFilled key={i} size={18} />
                          ) : (
                            <IconCarambola key={i} size={18} />
                          )
                        )}
                      </div>
                    </div>

                    {/* Comentario */}
                    <p className="text-texto leading-relaxed self-auto">
                      {r.comentario}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-texto text-center">
              Este usuario aún no ha publicado reseñas.
            </p>
          )}
        </div>
      </div>
      {/* Botón volver al mapa */}
      <div className="text-center">
        <MainLinkButton to="/mapa" variant="secondary">
          <IconArrowBack />
          Volver al mapa
        </MainLinkButton>
      </div>
    </section>
  );
};

export default Usuarios;
