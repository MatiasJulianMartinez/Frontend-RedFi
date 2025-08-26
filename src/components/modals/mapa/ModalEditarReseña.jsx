import { useState, useEffect } from "react";
import { IconX, IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import { obtenerProveedores } from "../../../services/proveedores/obtenerProveedor";
import ModalContenedor from "../../ui/ModalContenedor";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import TextArea from "../../ui/Textarea";

const ModalEditarReseña = ({ isOpen, onClose, reseña, onSave }) => {
  const [formData, setFormData] = useState({
    comentario: "",
    estrellas: 0,
    proveedor_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const cargarProveedores = async () => {
      if (isOpen) {
        try {
          const data = await obtenerProveedores();
          setProveedores(data);
        } catch (error) {
          console.error("Error al cargar proveedores:", error);
        }
      }
    };

    cargarProveedores();
  }, [isOpen]);

  useEffect(() => {
    if (reseña) {
      setFormData({
        comentario: reseña.comentario || "",
        estrellas: reseña.estrellas || 0,
        proveedor_id: reseña.proveedor_id || "",
      });
    }
  }, [reseña]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (rating) => {
    setFormData({
      ...formData,
      estrellas: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Editar reseña</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={loading}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-texto mb-2">
              Proveedor
            </label>
            <div className="w-full px-3 py-2 bg-texto/5 border border-texto/15 rounded-lg text-texto">
              {(() => {
                const proveedor = proveedores.find(
                  (p) => p.id === formData.proveedor_id
                );
                if (!proveedor) return "Cargando...";
                return `${proveedor.nombre}${
                  proveedor.tecnologia ? ` (${proveedor.tecnologia})` : ""
                }`;
              })()}
            </div>
          </div>

          {/* Estrellas */}
          <div>
            <label className="block font-medium text-texto mb-2">
              Calificación
            </label>
            <div className="flex gap-1 text-yellow-600 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl hover:scale-105 transition"
                  disabled={loading}
                >
                  {star <= formData.estrellas ? (
                    <IconCarambolaFilled size={24} />
                  ) : (
                    <IconCarambola size={24} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <TextArea
              label={
              <>
                Comentario <span className="text-red-600">*</span>
              </>
            }
              name="comentario"
              value={formData.comentario}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Escribe tu experiencia con este proveedor..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <MainButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Guardando..." : "Guardar"}
          </MainButton>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-texto/50 italic">
            Los campos marcados con <span className="text-red-600">*</span> son
            obligatorios.
          </p>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalEditarReseña;
