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
  const userId = reseña?.usuario_id;
  if (!reseña) return null;

  // Nombre (misma lógica tuya)
  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

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

  const proveedor =
    reseña.nombre_proveedor ||
    reseña.proveedores?.nombre ||
    reseña.proveedor?.nombre ||
    `Proveedor ID: ${reseña.proveedor_id}`;

  const fotoUrl =
    reseña?.user_profiles?.foto_url ||
    reseña?.user_profiles?.user?.foto_perfil ||
    null;

  // === Mismo diseño de estrellas que en ModalZonaMultiProveedor ===
  const renderStars = (promedio) => {
    const stars = [];
    const promedioRedondeado = Math.round(promedio || 0);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= promedioRedondeado ? (
          <IconCarambolaFilled key={i} size={24} className="text-yellow-600" />
        ) : (
          <IconCarambola key={i} size={24} className="text-texto/75" />
        )
      );
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex gap-1">{stars}</div>
        <span className="text-sm text-texto/75 ml-1">
          ({promedio ? Number(promedio).toFixed(1) : "0.0"})
        </span>
      </div>
    );
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Botón cerrar */}
      <MainButton
        onClick={onClose}
        variant="cross"
        title="Cerrar"
        className="absolute top-3 right-3"
      >
        <IconX size={24} />
      </MainButton>

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <Avatar fotoUrl={fotoUrl} nombre={nombre} size={20} />
      </div>

      {/* Nombre */}
      <MainH2 className="text-center justify-center">{nombre}</MainH2>

      {/* Estrellas */}
      <div className="mb-4 flex justify-center">
        {renderStars(reseña.estrellas)}
      </div>

      {/* Proveedor */}
      <div className="mb-4 flex justify-center">
        <Badge
          size="md"
          bgClass="bg-texto/5"
          textClass="text-texto"
          className="border border-texto/15 truncate max-w-[90%] sm:max-w-[420px]"
          title={proveedor}
        >
          Proveedor: <span className="font-bold ml-1">{proveedor}</span>
        </Badge>
      </div>

      {/* Comentario */}
      <p className="text-texto bg-texto/5 border border-texto/15 rounded-lg px-4 py-4 text-center leading-relaxed mb-6">
        {reseña.comentario}
      </p>

      {/* Botón "Ver perfil" */}
      <MainLinkButton
        to={`/usuarios/${userId}`}
        className="w-full px-4 py-2"
        icon={IconArrowRight}
        iconSize={16}
        iconPosition="right"
      >
        Ver perfil
      </MainLinkButton>
    </ModalContenedor>
  );
};

export default ModalReseña;
