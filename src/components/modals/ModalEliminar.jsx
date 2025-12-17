import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";
import { IconX } from "@tabler/icons-react";
import ModalContenedor from "../ui/ModalContenedor";

const ModalEliminar = ({
  titulo, // Palabra a eliminar (ej: "boleta", "proveedor")
  descripcion, // Palabra a eliminar en descripción (puede ser diferente del título)
  onConfirmar,
  onCancelar,
  loading = false,
}) => {
  // Generar título automáticamente
  const tituloCompleto = titulo ? `Eliminar ${titulo}` : "¿Estás seguro?";

  // Generar descripción automáticamente
  const getArticulo = (palabra) => {
    // Extraer solo la primera palabra para determinar el artículo
    const primeraPalabra = palabra?.split(" ")[0]?.toLowerCase();

    // Palabras que usan "este" en lugar de "esta"
    const palabrasConEste = [
      "perfil",
      "proveedor",
      "curso",
      "user_profiles",
      "usuario",
    ];
    return palabrasConEste.includes(primeraPalabra) ? "este" : "esta";
  };

  const descripcionCompleta = descripcion
    ? `¿Estás seguro de que quieres eliminar ${getArticulo(
        descripcion
      )} ${descripcion}?`
    : "Esta acción no se puede deshacer.";

  // Función para resaltar la palabra específica en rojo
  const highlightText = (text, wordToHighlight) => {
    if (!wordToHighlight) return text;

    return text
      .split(new RegExp(`(${wordToHighlight})`, "gi"))
      .map((part, index) =>
        part.toLowerCase() === wordToHighlight.toLowerCase() ? (
          <span key={index} className="text-texto font-bold">
            {part}
          </span>
        ) : (
          part
        )
      );
  };

  return (
    <ModalContenedor onClose={onCancelar}>
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">
          {titulo ? highlightText(tituloCompleto, titulo) : tituloCompleto}
        </MainH2>
        <MainButton
          onClick={onCancelar}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
          disabled={loading}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Descripción principal con posible resaltado */}
      <div className="text-center space-y-3">
        <p className="font-regular text-lg">
          {descripcion
            ? highlightText(descripcionCompleta, descripcion)
            : descripcionCompleta}
        </p>

        {/* Advertencia fija */}
        <p className="text-sm text-texto/75 italic">
          Esta acción no se puede deshacer.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center gap-3 pt-6">
        <MainButton
          onClick={onCancelar}
          variant="secondary"
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </MainButton>
        <MainButton
          onClick={onConfirmar}
          variant="danger"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalEliminar;
