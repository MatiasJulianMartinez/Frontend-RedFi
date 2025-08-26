import { useState, useEffect } from "react";
import {
  IconX,
  IconMapPin,
  IconLoader2,
  IconCarambola,
  IconCarambolaFilled,
  IconHandFinger,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainH3 from "../../ui/MainH3";
import MainButton from "../../ui/MainButton";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import ModalContenedor from "../../ui/ModalContenedor";
import { useValidacionUbicacion } from "../../../hooks/useValidacionUbicacion";
import { BOUNDS_CORRIENTES } from "../../../constants/constantes";

const ModalAgregarReseña = ({
  isOpen,
  onClose,
  onEnviar,
  mapRef,
  boundsCorrientes = BOUNDS_CORRIENTES,
  coordenadasSeleccionadas,
  onSeleccionarUbicacion,
}) => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [comentario, setComentario] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [loading, setLoading] = useState(false);
  const [pasoActual, setPasoActual] = useState(1); // 1: Ubicación, 2: Proveedor, 3: Calificación, 4: Comentario

  const {
    ubicacionActual,
    zonaActual,
    proveedoresDisponibles,
    cargandoUbicacion,
    cargandoProveedores,
    ubicacionValida,
    validarUbicacion,
    usarUbicacionActual,
    limpiarUbicacion,
  } = useValidacionUbicacion(boundsCorrientes);

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setPasoActual(1);
      setProveedorSeleccionado("");
      setComentario("");
      setEstrellas(5);
      limpiarUbicacion();
    }
  }, [isOpen, limpiarUbicacion]);

  // Validar coordenadas seleccionadas desde el mapa
  useEffect(() => {
    if (coordenadasSeleccionadas && isOpen) {
      const validarYAvanzar = async () => {
        // Validar silenciosamente (ya se mostró mensaje en MapaInteractivo)
        await validarUbicacion(coordenadasSeleccionadas, true);
        // Avanzar automáticamente al paso 2
        setPasoActual(2);
      };
      validarYAvanzar();
    }
  }, [coordenadasSeleccionadas, isOpen, validarUbicacion]); // Remover validarUbicacion de las dependencias

  const handleUbicacionActual = async () => {
    const success = await usarUbicacionActual();
    if (success) {
      setPasoActual(2); // Avanzar automáticamente
    }
  };

  const handleSeleccionarEnMapa = () => {
    onClose();
    onSeleccionarUbicacion();
  };

  const handleProveedorChange = (proveedorId) => {
    setProveedorSeleccionado(proveedorId);
  };

  const handleStarClick = (rating) => {
    setEstrellas(rating);
  };

  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  const handleContinuar = () => {
    if (pasoActual === 1) {
      // En el paso 1, validar que se haya seleccionado una ubicación
      if (ubicacionValida) {
        setPasoActual(2);
      }
    } else if (pasoActual === 2) {
      // En el paso 2, validar que se haya seleccionado un proveedor
      if (proveedorSeleccionado) {
        setPasoActual(3);
      }
    } else if (pasoActual === 3) {
      // En el paso 3, avanzar al paso 4 (comentario)
      setPasoActual(4);
    }
  };

  const handleAtras = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ubicacionActual || !proveedorSeleccionado || !comentario.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onEnviar({
        comentario: comentario.trim(),
        estrellas,
        proveedor_id: proveedorSeleccionado,
        ubicacion: ubicacionActual,
        ubicacionTexto: zonaActual?.departamento || "Ubicación seleccionada",
      });
      onClose();
    } catch (error) {
      console.error("Error al publicar reseña:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    onClose();
    limpiarUbicacion();
  };

  const renderPasoUbicacion = () => (
    <div className="space-y-4">
      <div className="text-center">
        <IconMapPin size={48} className="mx-auto mb-4 text-acento" />
        <MainH3 className="text-center justify-center">
          Selecciona tu ubicación
        </MainH3>
        <p className="text-texto">
          Necesitamos verificar que estés en una zona con cobertura de internet
        </p>
      </div>

      <div className="flex flex-row gap-3">
        <MainButton
          type="button"
          onClick={handleSeleccionarEnMapa}
          variant="accent"
          icon={IconHandFinger}
          className="w-full"
          loading={cargandoUbicacion}
        >
          {cargandoUbicacion ? "Verificando..." : "Elegir en mapa"}
        </MainButton>

        <MainButton
          type="button"
          onClick={handleUbicacionActual}
          loading={cargandoUbicacion}
          variant="primary"
          icon={IconMapPin}
          className="w-full"
        >
          {cargandoUbicacion ? "Verificando..." : "Usar ubicación"}
        </MainButton>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-3 pt-4">
        <MainButton
          type="button"
          variant="secondary"
          onClick={handleCerrar}
          className="flex-1"
        >
          Cancelar
        </MainButton>
        <MainButton
          type="button"
          variant="primary"
          onClick={handleContinuar}
          disabled={!ubicacionValida || cargandoUbicacion}
          className="flex-1"
        >
          Continuar
        </MainButton>
      </div>
    </div>
  );

  const renderPasoProveedor = () => (
    <div className="space-y-4">
      <div className="text-center">
        <IconCheck size={48} className="mx-auto mb-4 text-green-700" />
        <MainH3 className="text-center justify-center">Ubicación válida</MainH3>
        <p className="text-texto">
          Estás en <strong>{zonaActual?.departamento}</strong>
        </p>
      </div>

      <Select
        label="Selecciona tu proveedor de internet"
        value={proveedorSeleccionado}
        onChange={handleProveedorChange}
        options={[
          { id: "", nombre: "Seleccionar proveedores disponibles" },
          ...proveedoresDisponibles,
        ]}
        getOptionValue={(p) => p.id}
        getOptionLabel={(p) => p.nombre}
        loading={cargandoProveedores}
        placeholder="Seleccionar proveedores disponibles"
      />

      {proveedoresDisponibles.length === 0 && !cargandoProveedores && (
        <div className="text-center text-texto">
          <IconAlertCircle size={24} className="mx-auto mb-2" />
          <p>No hay proveedores disponibles en esta zona</p>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex gap-3 pt-4">
        <MainButton
          type="button"
          variant="secondary"
          onClick={handleAtras}
          className="flex-1"
        >
          Atrás
        </MainButton>
        <MainButton
          type="button"
          variant="primary"
          onClick={handleContinuar}
          disabled={!proveedorSeleccionado || cargandoProveedores}
          className="flex-1"
        >
          Continuar
        </MainButton>
      </div>
    </div>
  );

  const renderPasoCalificacion = () => (
    <div className="space-y-4">
      <div className="text-center">
        <MainH3 className="text-center justify-center">
          Califica tu experiencia
        </MainH3>
        <p className="text-texto">
          ¿Cómo calificarías el servicio de{" "}
          <strong>
            {
              proveedoresDisponibles.find(
                (p) => p.id === Number(proveedorSeleccionado)
              )?.nombre
            }
          </strong>
          ?
        </p>
      </div>

      <div className="flex justify-center gap-1 text-yellow-600 bg-texto/5 font-bold px-6 py-4 rounded-full border border-texto/15">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className="text-3xl hover:scale-110 transition p-2"
            disabled={loading}
          >
            {star <= estrellas ? (
              <IconCarambolaFilled size={32} />
            ) : (
              <IconCarambola size={32} />
            )}
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-texto/75">
          {estrellas === 1 && "Muy malo"}
          {estrellas === 2 && "Malo"}
          {estrellas === 3 && "Regular"}
          {estrellas === 4 && "Bueno"}
          {estrellas === 5 && "Excelente"}
        </p>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-3 pt-4">
        <MainButton
          type="button"
          variant="secondary"
          onClick={handleAtras}
          className="flex-1"
        >
          Atrás
        </MainButton>
        <MainButton
          type="button"
          variant="primary"
          onClick={handleContinuar}
          className="flex-1"
        >
          Continuar
        </MainButton>
      </div>
    </div>
  );

  const renderPasoComentario = () => (
    <div className="space-y-4">
      <div className="text-center">
        <MainH3 className="text-center justify-center">
          Cuéntanos más
        </MainH3>
        <p className="text-texto">Comparte tu experiencia con otros usuarios</p>
      </div>

      <Textarea
        label="Tu comentario"
        name="comentario"
        value={comentario}
        onChange={handleComentarioChange}
        placeholder="Describe tu experiencia con el servicio de internet..."
        rows={4}
        required
      />

      {/* Botones de navegación */}
      <div className="flex gap-3">
        <MainButton
          type="button"
          variant="secondary"
          onClick={handleAtras}
          disabled={loading}
          className="flex-1"
        >
          Atrás
        </MainButton>
        <MainButton
          type="submit"
          variant="primary"
          disabled={loading || !comentario.trim()}
          className="flex-1"
        >
          {loading ? "Publicando..." : "Publicar Reseña"}
        </MainButton>
      </div>
    </div>
  );

  const renderContenido = () => {
    switch (pasoActual) {
      case 1:
        return renderPasoUbicacion();
      case 2:
        return renderPasoProveedor();
      case 3:
        return renderPasoCalificacion();
      case 4:
        return renderPasoComentario();
      default:
        return renderPasoUbicacion();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContenedor onClose={handleCerrar}>
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Agregar reseña</MainH2>
        <MainButton
          onClick={handleCerrar}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Indicador de progreso */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((paso) => (
            <div
              key={paso}
              className={`w-3 h-3 rounded-full transition-colors ${
                paso <= pasoActual ? "bg-acento" : "bg-texto/20"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>{renderContenido()}</form>
    </ModalContenedor>
  );
};

export default ModalAgregarReseña;
