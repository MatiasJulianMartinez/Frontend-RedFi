import { useEffect, useState } from "react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import FileInput from "../../../ui/FileInput";
import CheckboxDropdown from "../../../ui/CheckboxDropdown";
import { IconX } from "@tabler/icons-react";
import { obtenerTecnologiasDisponibles, obtenerZonasDisponibles } from "../../../../services/proveedores/relacionesProveedor";
import { actualizarProveedor } from "../../../../services/proveedores/crudProveedor";
import { subirLogoProveedor, eliminarLogoProveedor } from "../../../../services/proveedores/logoProveedor";
import { useAlerta } from "../../../../context/AlertaContext";
import ModalContenedor from "../../../ui/ModalContenedor";

const ModalEditarProveedor = ({ proveedor, onClose, onActualizar }) => {
  const [form, setForm] = useState({ ...proveedor });
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    const prepararPreviewDesdeURL = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = "logo.png";
        const file = new File([blob], filename, { type: blob.type });

        setLogoFile(file);
        setPreviewUrl(url);
      } catch (error) {
        console.error("❌ Error al generar archivo desde URL:", error);
      }
    };

    if (proveedor) {
      setForm({
        nombre: proveedor.nombre || "",
        sitio_web: proveedor.sitio_web || "",
        descripcion: proveedor.descripcion || "",
        color: proveedor.color || "#000000",
        logotipo: proveedor.logotipo || null,
        eliminarLogo: false,
      });


      if (proveedor.logotipo) {
        prepararPreviewDesdeURL(proveedor.logotipo);
      }
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (campo, valores) => {
    setForm((prev) => ({ ...prev, [campo]: valores }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = form.logotipo || null;

      if (form.eliminarLogo) {
        logoUrl = null;
        await eliminarLogoProveedor(form.nombre);
      } else if (logoFile) {
        logoUrl = await subirLogoProveedor(form.nombre, logoFile);
      }

      const { eliminarLogo, ...restoForm } = form;
      await actualizarProveedor(proveedor.id, {
        ...restoForm,
        logotipo: logoUrl,
      });
      mostrarExito("Proveedor actualizado correctamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      mostrarError("Error al actualizar proveedor: " + error.message);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Editar proveedor</MainH2>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Input
              label={
                <>
                  Nombre del proveedor <span className="text-red-600">*</span>
                </>
              }
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nombre del proveedor"
            />
          </div>

          <div className="flex-1">
            <Input
              label="Sitio web (url)"
              name="sitio_web"
              value={form.sitio_web || ""}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://www.ejemplo.com"
            />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Textarea
              label="Descripción"
              name="descripcion"
              value={form.descripcion || ""}
              onChange={handleChange}
              rows={8}
              disabled={loading}
              placeholder="Descripción del proveedor"
            />
          </div>
          <div className="flex-1">
            <FileInput
              label="Logotipo"
              id="logo"
              value={logoFile}
              onChange={(file) => {
                setLogoFile(file);

                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPreviewUrl(reader.result);
                  reader.readAsDataURL(file);

                  // Si hay imagen, cancelar la eliminación
                  setForm((prev) => ({ ...prev, eliminarLogo: false }));
                } else {
                  // Si se quitó la imagen
                  setPreviewUrl(null);
                  setForm((prev) => ({ ...prev, eliminarLogo: true }));
                }
              }}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              accept="image/*"
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <label className="block text-texto mb-1">Color <span className="text-red-600">*</span></label>
          <div className="flex items-center gap-4">
            {/* Color picker visual */}
            <Input
              type="color"
              name="color"
              value={form.color || "#000000"}
              onChange={handleChange}
              disabled={loading}
              required
              title="Selecciona un color"
            />

            <div className="flex-1">
              <Input
                type="text"
                name="color"
                value={form.color || ""}
                onChange={(e) => {
                  const hex = e.target.value;
                  const isValid = /^#[0-9A-Fa-f]{0,6}$/.test(hex) || hex === "";

                  if (isValid) {
                    setForm((prev) => ({ ...prev, color: hex }));
                  }
                }}
                disabled={loading}
                placeholder="#000000"
                maxLength={7}
                required
              />
            </div>

            <div
              className="w-10 h-10 rounded border border-texto/15"
              style={{
                backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(form.color || "")
                  ? form.color
                  : "#000000",
              }}
              title={`Color: ${form.color}`}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
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
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
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

export default ModalEditarProveedor;
