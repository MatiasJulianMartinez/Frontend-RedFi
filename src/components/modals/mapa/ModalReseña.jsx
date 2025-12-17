import {
  IconX,
  IconCarambolaFilled,
  IconCarambola,
  IconExternalLink,
} from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainH3 from "../../ui/MainH3";
import MainButton from "../../ui/MainButton";
import Avatar from "../../ui/Avatar";
import ModalContenedor from "../../ui/ModalContenedor";
import MainLinkButton from "../../ui/MainLinkButton";

const ModalReseña = ({ reseña, onClose }) => {
  // Verifica que existe la reseña antes de renderizar
  if (!reseña) return null;

  // Obtiene el ID del usuario para navegación al perfil
  const userId = reseña?.usuario_id;

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

  // Obtiene el ID del proveedor para navegación
  const proveedorId =
    reseña.proveedor_id ||
    reseña.proveedores?.id ||
    reseña.proveedor?.id;

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

  // Formatea la fecha de creación de la reseña
  const fechaReseña = reseña.created_at
    ? new Date(reseña.created_at).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha desconocida";

  // Renderiza el sistema de estrellas con calificación específica de la reseña
  const renderStars = (promedio) => {
    const stars = [];
    const promedioRedondeado = Math.round(promedio || 0);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= promedioRedondeado ? (
          <IconCarambolaFilled key={i} size={18} className="text-yellow-600" />
        ) : (
          <IconCarambola key={i} size={18} className="text-texto/75" />
        )
      );
    }

    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Reseña</MainH2>
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

      <div className="space-y-6">
        {/* Sección del proveedor */}
        <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Logo del proveedor */}
            <div className="flex-shrink-0">
              <Avatar
                fotoUrl={proveedorLogo}
                nombre={proveedor}
                size={16}
                className="rounded-full"
              />
            </div>

            {/* Información del proveedor */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs uppercase tracking-wide text-texto/75 mb-1">
                Proveedor
              </p>
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <MainH3 className="text-xl mb-0 justify-center sm:justify-start">
                  {proveedor}
                </MainH3>
                <MainLinkButton
                  to={`/proveedores/${proveedorId}`}
                  variant="link"
                  className="p-1 flex-shrink-0"
                  icon={IconExternalLink}
                  iconSize={18}
                  iconAlwaysVisible={true}
                  title="Ver perfil del proveedor"
                />
              </div>
            </div>

            {/* Calificación con estrellas */}
            <div className="flex-shrink-0 flex items-center gap-2 bg-texto/5 px-4 py-2 rounded-full border border-texto/15">
              {renderStars(reseña.estrellas)}
              <span className="text-sm font-bold text-texto whitespace-nowrap">
                ({reseña.estrellas})
              </span>
            </div>
          </div>
        </div>

        {/* Sección del usuario que hizo la reseña */}
        <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar del usuario */}
            <div className="flex-shrink-0">
              <Avatar fotoUrl={fotoUrl} nombre={nombre} size={14} />
            </div>

            {/* Información del usuario */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <MainH3 className="text-lg mb-0 justify-start">{nombre}</MainH3>
                <MainLinkButton
                  to={`/usuarios/${userId}`}
                  variant="link"
                  className="p-1 flex-shrink-0"
                  icon={IconExternalLink}
                  iconSize={18}
                  iconAlwaysVisible={true}
                  title="Ver perfil del usuario"
                />
              </div>
              <p className="text-xs text-texto/75 mt-1">{fechaReseña}</p>
            </div>
          </div>

          {/* Comentario */}
          <div>
            <p className="text-xs uppercase tracking-wide text-texto/75 mb-2">
              Comentario
            </p>
            <div className="bg-texto/10 rounded-lg px-4 py-3 max-h-[200px] overflow-y-auto">
              <p className="leading-relaxed whitespace-pre-wrap break-words text-left text-texto">
                {reseña.comentario}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="w-full">
          <MainButton
            type="button"
            variant="primary"
            onClick={onClose}
            className="w-full"
          >
            Cerrar
          </MainButton>
        </div>
      </div>
    </ModalContenedor>
  );
};

export default ModalReseña;