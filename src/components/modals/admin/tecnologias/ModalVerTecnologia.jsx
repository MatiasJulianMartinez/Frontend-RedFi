import { IconX } from "@tabler/icons-react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import ModalContenedor from "../../../ui/ModalContenedor";

const ModalVerTecnologia = ({ tecnologia, onClose }) => {
  // Verifica que existe la tecnología antes de renderizar
  if (!tecnologia) return null;
  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between items-start mb-6">
        <MainH2 className="mb-0">Detalle de tecnología</MainH2>
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

      {/* Información detallada de la tecnología */}
      <div className="space-y-6 mb-8">
        {/* Descripción */}
        <div className="bg-texto/5 border border-texto/15 rounded-lg p-4">
          <p className="text-texto">
            {" "}
            <span className="text-acento font-bold">
              {tecnologia.tecnologia}
            </span>{" "}
            = {tecnologia.descripcion || "Sin descripción disponible"}
          </p>
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

export default ModalVerTecnologia;
