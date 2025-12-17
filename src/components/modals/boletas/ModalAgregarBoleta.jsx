import { useState } from "react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import FileInput from "../../ui/FileInput";
import ModalContenedor from "../../ui/ModalContenedor";
import {
  IconCalendar,
  IconCurrencyDollar,
  IconWifi,
  IconX,
} from "@tabler/icons-react";
import { obtenerUsuarioActual } from "../../../services/boletas/auth";
import { subirImagenBoleta } from "../../../services/boletas/upload";
import { guardarBoleta } from "../../../services/boletas/crud";
import { useAlerta } from "../../../context/AlertaContext";

// Helpers para manejar fecha base del período y formato YYYY-MM-DD
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
  const dosDigitos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dosDigitos(
    fecha.getMonth() + 1
  )}-${dosDigitos(fecha.getDate())}`;
};

const ModalAgregarBoleta = ({
  onClose,
  onBoletaAgregada,
  onActualizarNotificaciones,
}) => {
  // Estado del formulario con datos de la boleta
  const [form, setForm] = useState({
    mes: "",
    anio: "",
    monto: "",
    proveedor: "",
    vencimiento: "",
    promoHasta: "",
    proveedorOtro: "",
  });

  // Estados para la gestión del archivo y carga
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { mostrarExito, mostrarError } = useAlerta();

  // Opciones disponibles para el selector de mes
  const meses = [
    { label: "Seleccionar mes", value: "" },
    { label: "Enero", value: "Enero" },
    { label: "Febrero", value: "Febrero" },
    { label: "Marzo", value: "Marzo" },
    { label: "Abril", value: "Abril" },
    { label: "Mayo", value: "Mayo" },
    { label: "Junio", value: "Junio" },
    { label: "Julio", value: "Julio" },
    { label: "Agosto", value: "Agosto" },
    { label: "Septiembre", value: "Septiembre" },
    { label: "Octubre", value: "Octubre" },
    { label: "Noviembre", value: "Noviembre" },
    { label: "Diciembre", value: "Diciembre" },
  ];

  // Opciones disponibles para el selector de proveedor
  const proveedores = [
    { label: "Seleccionar proveedor", value: "" },
    { label: "Fibertel", value: "Fibertel" },
    { label: "Telecentro", value: "Telecentro" },
    { label: "Claro", value: "Claro" },
    { label: "Movistar", value: "Movistar" },
    { label: "Otro", value: "Otro" },
  ];

  // Maneja los cambios en los campos de texto del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja los cambios en los campos de selección
  const handleSelectChange = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  // Fecha base (1° del mes/año elegidos) para bloquear fechas anteriores
  const indiceMes = aIndiceMes(form.mes);
  const anioNumero = parseInt(form.anio, 10);
  const fechaBase =
    form.mes && form.anio ? new Date(anioNumero, indiceMes, 1) : null;
  const minISO = fechaBase ? aFechaISO(fechaBase) : undefined;

  // Procesa el envío del formulario y guarda la boleta
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas
      if (!form.mes) {
        mostrarError("Debes seleccionar un mes válido.");
        setLoading(false);
        return;
      }
      if (!form.anio) {
        mostrarError("Debes ingresar un año válido.");
        setLoading(false);
        return;
      }
      if (!form.proveedor) {
        mostrarError("Debes seleccionar un proveedor válido.");
        setLoading(false);
        return;
      }
      if (form.proveedor === "Otro" && !form.proveedorOtro.trim()) {
        mostrarError("Debes ingresar el nombre del proveedor.");
        setLoading(false);
        return;
      }

      // Validación de fechas contra el período
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

      const user = await obtenerUsuarioActual();
      if (!user) {
        mostrarError("Debes iniciar sesión.");
        setLoading(false);
        return;
      }

      let url_imagen = null;
      if (archivo) {
        url_imagen = await subirImagenBoleta(archivo);
      }

      const vencimientoAjustado = new Date(
        form.vencimiento + "T12:00:00"
      ).toISOString();

      const promoHastaAjustado = form.promoHasta
        ? new Date(form.promoHasta + "T12:00:00").toISOString()
        : null;

      const proveedorFinal =
        form.proveedor === "Otro" ? form.proveedorOtro : form.proveedor;

      await guardarBoleta({
        mes: form.mes,
        anio: form.anio,
        monto: form.monto,
        proveedor: proveedorFinal,
        user_id: user.id,
        vencimiento: vencimientoAjustado,
        promo_hasta: promoHastaAjustado,
        url_imagen,
      });

      mostrarExito("Boleta guardada correctamente.");

      setForm({
        mes: "",
        anio: "",
        monto: "",
        proveedor: "",
        vencimiento: "",
        promoHasta: "",
        proveedorOtro: "",
      });
      setArchivo(null);
      setPreviewUrl(null);

      onBoletaAgregada?.();
      onActualizarNotificaciones?.();
      window.dispatchEvent(new Event("nueva-boleta"));

      onClose();
    } catch (error) {
      console.error(error);
      mostrarError("Error al guardar la boleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Agregar boleta</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          aria-label="Cerrar"
          className="px-0"
        >
          <IconX />
        </MainButton>
      </div>

      {/* Formulario de creación de boleta */}
      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
        {/* Campos principales del formulario */}
        <div className="grid grid-cols-2 gap-4">
          {/* Selector de mes (obligatorio) */}
          <Select
            label={
              <>
                Mes <span className="text-red-600">*</span>
              </>
            }
            name="mes"
            value={form.mes}
            onChange={handleSelectChange("mes")}
            options={meses}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label}
            required
          />

          {/* Campo año (obligatorio) */}
          <Input
            label={
              <>
                Año <span className="text-red-600">*</span>
              </>
            }
            name="anio"
            type="number"
            value={form.anio}
            onChange={handleChange}
            placeholder="Ej. 2025"
            min={2020}
            max={2030}
            maxLength={4}
            required
          />

          {/* Campo monto (obligatorio) */}
          <Input
            label={
              <>
                Monto <span className="text-red-600">*</span>
              </>
            }
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto"
            required
            min="0"
            step="0.01"
            icon={IconCurrencyDollar}
          />

          {/* Selector de proveedor (obligatorio) */}
          <Select
            label={
              <>
                Proveedor <span className="text-red-600">*</span>
              </>
            }
            name="proveedor"
            value={form.proveedor}
            onChange={handleSelectChange("proveedor")}
            options={proveedores}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label}
            required
            icon={IconWifi}
          />
        </div>

        {/* Campo proveedor personalizado (solo si selecciona "Otro") */}
        {form.proveedor === "Otro" && (
          <Input
            label={
              <>
                Nombre del proveedor <span className="text-red-600">*</span>
              </>
            }
            name="proveedorOtro"
            value={form.proveedorOtro}
            onChange={handleChange}
            placeholder="Ej. Red Fibra Z"
            required
            maxLength={50}
            showCounter={true}
          />
        )}

        {/* Campos de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={
              <>
                Fecha de vencimiento <span className="text-red-600">*</span>
              </>
            }
            name="vencimiento"
            type="date"
            value={form.vencimiento}
            onChange={handleChange}
            required
            icon={IconCalendar}
            min={minISO} // 👈 restricción
          />

          <Input
            label="Fin de promoción"
            name="promoHasta"
            type="date"
            value={form.promoHasta}
            onChange={handleChange}
            icon={IconCalendar}
            min={minISO} // 👈 restricción
          />
        </div>

        {/* Campo de archivo */}
        <FileInput
          id="archivo"
          label="Archivo de la boleta"
          value={archivo}
          onChange={setArchivo}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          accept="image/*, application/pdf"
          esBoletas={true}
        />

        {/* Botones */}
        <div className="flex justify-center gap-3">
          <MainButton
            type="button"
            variant="secondary"
            onClick={onClose}
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
            {loading ? "Guardando..." : "Guardar"}
          </MainButton>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-texto/75 italic">
            Los campos marcados con <span className="text-red-600">*</span> son
            obligatorios.
          </p>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalAgregarBoleta;
