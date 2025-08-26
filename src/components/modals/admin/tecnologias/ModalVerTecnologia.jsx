import { IconX } from "@tabler/icons-react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import ModalContenedor from "../../../ui/ModalContenedor";

const ModalVerTecnologia = ({ tecnologia, onClose }) => {
    if (!tecnologia) return null;
  return (
    <ModalContenedor onClose={onClose}>
        <div className="flex justify-between items-start mb-6">
          <MainH2 className="mb-0">Detalle de Tecnología</MainH2>
          <MainButton
            onClick={onClose}
            type="button"
            variant="cross"
            title="Cerrar modal"
          >
            <IconX size={24} />
          </MainButton>
        </div>

        <div className="space-y-3">
          <div>
            <p className="font-bold">Nombre</p>
            <p>{tecnologia.tecnologia}</p>
          </div>

          <div>
            <p className="font-bold">Descripcion</p>
            <p>{tecnologia.descripcion || "-"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <MainButton variant="primary" onClick={onClose}>
            Cerrar
          </MainButton>
        </div>
      </ModalContenedor>
  );
};

export default ModalVerTecnologia