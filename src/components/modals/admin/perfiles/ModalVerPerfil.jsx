import { IconX } from "@tabler/icons-react";
import Avatar from "../../../ui/Avatar";
import Badge from "../../../ui/Badge";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import ModalContenedor from "../../../ui/ModalContenedor";

const ModalVerPerfil = ({ perfil, onClose }) => {
  if (!perfil) return null;

  const { nombre, proveedor_preferido, rol, plan, foto_url } = perfil;

  // Función para determinar la variante del badge según el tipo
  const obtenerVarianteBadge = (tipo, valor) => {
    if (tipo === "rol" && valor === "admin") return "admin";
    if (tipo === "plan" && valor === "premium") return "premium";
    return "muted";
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between items-start mb-6">
        <MainH2 className="mb-0">Detalle del perfil</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Avatar y nombre del usuario */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar fotoUrl={foto_url} nombre={nombre} size={32} />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-2xl font-bold text-texto">{nombre}</h3>
        </div>
      </div>

      {/* Información detallada del perfil */}
      <div className="space-y-6 mb-8">
        {/* Proveedor preferido */}
        <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-texto/75 uppercase tracking-wide">
              Proveedor preferido:
            </span>
            <p className="text-lg font-semibold text-texto">
              {proveedor_preferido || "Sin proveedor asignado"}
            </p>
          </div>
        </div>

        {/* Rol y Plan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-texto/75 uppercase tracking-wide">
                Rol:
              </span>
              <Badge
                size="md"
                variant={obtenerVarianteBadge("rol", rol)}
                className="font-semibold"
              >
                {rol}
              </Badge>
            </div>
          </div>

          <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-texto/75 uppercase tracking-wide">
                Plan:
              </span>
              <Badge
                size="md"
                variant={obtenerVarianteBadge("plan", plan)}
                className="font-semibold"
              >
                {plan}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cierre */}
      <div className="flex justify-center">
        <MainButton
          variant="primary"
          className="w-full flex-1"
          onClick={onClose}
        >
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerPerfil;
