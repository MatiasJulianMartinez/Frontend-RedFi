import {
  IconX,
  IconCarambolaFilled,
  IconCarambola,
  IconArrowRight,
} from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainButton from "../../ui/MainButton";
import Avatar from "../../ui/Avatar";
import ModalContenedor from "../../ui/ModalContenedor";
import MainLinkButton from "../../ui/MainLinkButton";
import Badge from "../../ui/Badge";

const ModalReseña = ({ reseña, onClose }) => {
  // Obtiene el ID del usuario para navegación al perfil
  const userId = reseña?.usuario_id;

  // Verifica que existe la reseña antes de renderizar
  if (!reseña) return null;

  // Procesa el nombre del usuario desde diferentes estructuras de datos posibles
  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

  // Parsea nombres que pueden estar en formato JSON o texto plano
  let nombre;
  try {
    if (nombreBruto?.includes("{")) {
      const match = nombreBruto.match(/Usuario (.*)/);
      const json = match ? JSON.parse(match[1]) : null;
      nombre = json?.nombre || nombreBruto;
    } else {
      nombre = nombreBruto;
    }
  } catch {
    nombre = nombreBruto;
  }

  // Obtiene el nombre del proveedor desde diferentes fuentes posibles
  const proveedor =
    reseña.nombre_proveedor ||
    reseña.proveedores?.nombre ||
    reseña.proveedor?.nombre ||
    `Proveedor ID: ${reseña.proveedor_id}`;

  // Obtiene la URL de la foto de perfil del usuario
  const fotoUrl =
    reseña?.user_profiles?.foto_url ||
    reseña?.user_profiles?.user?.foto_perfil ||
    null;

  // Obtiene el logo del proveedor
  const proveedorLogo =
    reseña?.proveedores?.logotipo ||
    reseña?.proveedor?.logotipo ||
    reseña?.logotipo ||
    null;

  // Renderiza el sistema de estrellas con calificación específica de la reseña
  const renderStars = (promedio) => {
    const stars = [];
    const promedioRedondeado = Math.round(promedio || 0);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= promedioRedondeado ? (
          <IconCarambolaFilled key={i} size={22} className="text-yellow-600" />
        ) : (
          <IconCarambola key={i} size={22} className="text-texto/75" />
        )
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-1">{stars}</div>
        <span className="text-xs text-texto/75 mt-1">
          ({promedio ? Number(promedio).toFixed(1) : "0.0"})
        </span>
      </div>
    );
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Botón de cierre del modal */}
      <MainButton
        onClick={onClose}
        variant="cross"
        title="Cerrar"
        className="absolute top-3 right-3"
      >
        <IconX size={24} />
      </MainButton>

      <div className="flex flex-col items-center gap-5">
        {/* Avatar y nombre */}
        <div className="flex flex-col items-center gap-2">
          <Avatar fotoUrl={fotoUrl} nombre={nombre} size={20} />
          <MainH2 className="text-center justify-center text-lg">
            {nombre}
          </MainH2>
        </div>

        {/* --- NUEVO BLOQUE COMPACTO ARRIBA --- */}
        <div className="w-full max-w-[450px] flex items-center justify-between px-4 py-3 rounded-lg bg-texto/5 border border-texto/15">
          {/* Proveedor: logo + nombre */}
          <div className="flex items-center gap-3">
            {proveedorLogo && (
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <img
                  src={proveedorLogo}
                  alt={proveedor}
                  className="w-10 h-10 object-contain rounded-full"
                />
              </div>
            )}

            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-wide text-texto/75">
                Proveedor
              </span>
              <span className="font-bold text-base">{proveedor}</span>
            </div>
          </div>

          {/* Estrellas a la derecha */}
          <div>{renderStars(reseña.estrellas)}</div>
        </div>

        {/* Comentario */}
        <div className="w-full max-w-[450px]">
          <p className="text-xs uppercase tracking-wide text-texto/75 mb-1">
            Comentario de la reseña
          </p>
          <div className="text-texto bg-texto/5 border border-texto/15 rounded-lg px-4 py-4 max-h-[260px] overflow-y-auto">
            <p className="leading-relaxed whitespace-pre-wrap break-words text-left">
              {reseña.comentario}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 w-full max-w-[450px]">
          <MainButton
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cerrar
          </MainButton>

          <MainLinkButton
            to={`/usuarios/${userId}`}
            className="flex-1 px-4 py-2"
            icon={IconArrowRight}
            iconSize={16}
            iconPosition="right"
          >
            Ver perfil
          </MainLinkButton>
        </div>
      </div>
    </ModalContenedor>
  );
};

export default ModalReseña;
