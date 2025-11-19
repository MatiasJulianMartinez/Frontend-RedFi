import { useState, useEffect } from "react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import Input from "../../ui/Input";
import FileInput from "../../ui/FileInput";
import Select from "../../ui/Select";
import ModalContenedor from "../../ui/ModalContenedor";
import {
  IconX,
  IconCalendar,
  IconCurrencyDollar,
  IconWifi,
} from "@tabler/icons-react";
import { actualizarBoletaConImagen } from "../../../services/boletas/crud";
import { useAlerta } from "../../../context/AlertaContext";

// Helpers en español para trabajar con la fecha base del período
const aIndiceMes = (mes) => {
  const nombres = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  if (!mes) return 0;
  if (!isNaN(mes)) return Math.max(0, Math.min(11, parseInt(mes, 10) - 1));
  const i = nombres.indexOf(String(mes).toLowerCase());
  return i >= 0 ? i : 0;
};

const aFechaISO = (fecha) => {
  const dos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(
    fecha.getDate()
  )}`;
};

const ModalEditarBoleta = ({ boleta, onClose, onActualizar }) => {
  // Verifica si el proveedor está en la lista predefinida
  const esProveedorValido = [
    "Fibertel",
    "Telecentro",
    "Claro",
    "Movistar",
  ].includes(boleta.proveedor);

  // Convierte fecha ISO a formato YYYY-MM-DD para inputs de tipo date
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    // Evita desfases de zona horaria manteniendo solo la parte de fecha
    return d.toISOString().split("T")[0];
  };

  // Estado del formulario inicializado con datos de la boleta existente
  const [form, setForm] = useState({
    ...boleta,
    proveedor: esProveedorValido ? boleta.proveedor : "Otro",
    proveedorOtro: esProveedorValido ? "" : boleta.proveedor,
    vencimiento: formatFecha(boleta.vencimiento),
    promoHasta: formatFecha(boleta.promo_hasta),
  });

  // Estados para la gestión de archivos e imagen
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagenEliminada, setImagenEliminada] = useState(false);

  const { mostrarExito, mostrarError } = useAlerta();

  // Opciones disponibles para el selector de mes
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Opciones disponibles para el selector de proveedor
  const proveedores = ["Fibertel", "Telecentro", "Claro", "Movistar", "Otro"];

  // Inicializa la vista previa con la imagen existente de la boleta
  useEffect(() => {
    if (boleta.url_imagen) {
      setPreview(boleta.url_imagen);
    }
  }, [boleta.url_imagen]);

  // Maneja los cambios en los campos de texto del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja los cambios en los campos de selección
  const handleSelectChange = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  // Elimina la imagen actual y resetea el archivo nuevo
  const handleClearImagen = () => {
    setArchivoNuevo(null);
    setPreview(null);
    setImagenEliminada(true);
  };

  // --- Fecha base del período (1° del mes/año) y min para inputs ---
  const indiceMes = aIndiceMes(form.mes);
  const anioNumero = parseInt(form.anio, 10);
  const fechaBase =
    form.mes && form.anio ? new Date(anioNumero, indiceMes, 1) : null;
  const minISO = fechaBase ? aFechaISO(fechaBase) : undefined;

  // Procesa la actualización de la boleta con los cambios realizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validaciones de fechas contra el período
      const fechaVenc = form.vencimiento
        ? new Date(form.vencimiento + "T12:00:00")
        : null;
      const fechaPromo = form.promoHasta
        ? new Date(form.promoHasta + "T12:00:00")
        : null;

      if (fechaBase && fechaVenc && fechaVenc < fechaBase) {
        mostrarError(
          "La fecha de vencimiento debe ser posterior o igual al período seleccionado."
        );
        setLoading(false);
        return;
      }
      if (fechaBase && fechaPromo && fechaPromo < fechaBase) {
        mostrarError(
          "La fecha de promoción debe ser posterior o igual al período seleccionado."
        );
        setLoading(false);
        return;
      }

      const datosFinales = {
        ...form,
        proveedor:
          form.proveedor === "Otro" ? form.proveedorOtro : form.proveedor,
        promo_hasta: form.promoHasta, // mapeo al nombre esperado por el backend si usa snake_case
      };

      // Eliminar campos innecesarios o solo de UI
      delete datosFinales.proveedorOtro;
      delete datosFinales.promoHasta;

      await actualizarBoletaConImagen(
        boleta,
        datosFinales,
        archivoNuevo,
        imagenEliminada
      );

      mostrarExito("Boleta actualizada correctamente.");
      window.dispatchEvent(new Event("nueva-boleta"));
      onActualizar?.();
      onClose();
    } catch (error) {
      console.error(error);
      mostrarError("Error al actualizar la boleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Editar boleta</MainH2>
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

      {/* Formulario de edición de boleta */}
      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Selector de mes */}
          <Select
            name="mes"
            value={form.mes}
            onChange={handleSelectChange("mes")}
            options={meses}
            label="Mes"
          />

          {/* Campo año */}
          <Input
            name="anio"
            value={form.anio}
            onChange={handleChange}
            placeholder="Año"
            label="Año"
          />

          {/* Campo monto */}
          <Input
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto"
            label="Monto"
            icon={IconCurrencyDollar}
          />

          {/* Selector de proveedor */}
          <Select
            name="proveedor"
            value={form.proveedor}
            onChange={handleSelectChange("proveedor")}
            options={proveedores}
            label="Proveedor"
            icon={IconWifi}
          />
        </div>

        {/* Campo proveedor personalizado (solo si selecciona "Otro") */}
        {form.proveedor === "Otro" && (
          <Input
            label="Nombre del proveedor"
            name="proveedorOtro"
            value={form.proveedorOtro}
            onChange={handleChange}
            placeholder="Ej. Red Fibra Z"
            required
            maxLength={50}
            showCounter={true}
          />
        )}

        {/* Campos de fechas - responsivo para mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo fecha de vencimiento */}
          <Input
            name="vencimiento"
            type="date"
            value={form.vencimiento}
            onChange={handleChange}
            label="Fecha de vencimiento"
            icon={IconCalendar}
            min={minISO} // 👈 bloqueo a partir del 1° del período
          />

          {/* Campo fin de promoción */}
          <Input
            name="promoHasta"
            type="date"
            value={form.promoHasta}
            onChange={handleChange}
            label="Fin de promoción"
            icon={IconCalendar}
            min={minISO} // 👈 bloqueo a partir del 1° del período
          />
        </div>

        {/* Campo de carga/edición de archivo */}
        <FileInput
          id="archivoNuevo"
          label="Archivo de la boleta"
          accept="image/*, application/pdf"
          value={archivoNuevo}
          onChange={(file) => {
            setArchivoNuevo(file);
            setImagenEliminada(false); // si elige una nueva, ya no es una eliminación
          }}
          previewUrl={preview}
          setPreviewUrl={setPreview}
          existingImage={
            boleta.url_imagen && !imagenEliminada ? boleta.url_imagen : null
          }
          onClear={handleClearImagen}
          esBoletas={true}
        />

        {/* Botones de acción */}
        <div className="flex justify-center gap-3">
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
            Guardar
          </MainButton>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalEditarBoleta;
