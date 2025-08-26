import { IconX } from "@tabler/icons-react";
import Avatar from "../../../ui/Avatar";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import ModalContenedor from "../../../ui/ModalContenedor";
import classNames from "classnames";

const badgeEstilo = (tipo) =>
  classNames(
    "px-3 py-1 rounded-lg font-bold inline-block",
    {
      admin: "bg-acento text-texto",
      user: "bg-blue-600 text-texto",
      premium: "bg-yellow-500 text-texto",
      basico: "bg-gray-500 text-texto",
    }[tipo] || "bg-texto/5 text-texto"
  );

const ModalVerPerfil = ({ perfil, onClose }) => {
  if (!perfil) return null;

  const { nombre, proveedor_preferido, rol, plan, foto_url } = perfil;

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <MainH2 className="mb-0">Detalle del Perfil</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Avatar + nombre */}
      <div className="flex flex-col items-center text-texto mb-6">
        <Avatar fotoUrl={foto_url} nombre={nombre} size={28} />
        <p className="mt-4 text-xl font-semibold">{nombre}</p>
      </div>

      {/* Detalles */}
      <div className="bg-secundario rounded-lg px-4 py-4 space-y-4 text-texto border border-secundario/50">
        <div>
          <p className="font-bold">Proveedor preferido</p>
          <p>{proveedor_preferido || "—"}</p>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <p className="text-texto font-bold">Rol</p>
            <span className={badgeEstilo(rol)}>{rol}</span>
          </div>
          <div className="flex-1">
            <p className="text-texto font-bold">Plan</p>
            <span className={badgeEstilo(plan)}>{plan}</span>
          </div>
        </div>
      </div>

      {/* Botón */}
      <div className="mt-6 flex justify-end">
        <MainButton variant="primary" onClick={onClose}>
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerPerfil;
