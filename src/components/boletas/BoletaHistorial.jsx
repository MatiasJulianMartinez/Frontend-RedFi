import { useEffect, useState } from "react";
import { eliminarBoletaConImagen } from "../../services/boletas/crud";
import ModalEditarBoleta from "../modals/boletas/ModalEditarBoleta";
import ModalVerBoleta from "../modals/boletas/ModalVerBoleta";
import ModalEliminar from "../modals/ModalEliminar";
import MainH3 from "../ui/MainH3";
import MainButton from "../ui/MainButton";
import MainLoader from "../ui/MainLoader";
import Table from "../ui/Table";
import { useAlerta } from "../../context/AlertaContext";

// >>> NUEVO: control de filtro + orden
import FiltroOrden from "../ui/FiltroOrden";

const BoletaHistorial = ({ boletas, recargarBoletas }) => {
  // Estados para control de UI y modales
  const [cargando, setCargando] = useState(true);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [boletaParaVer, setBoletaParaVer] = useState(null);
  const [boletaAEliminar, setBoletaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const { mostrarExito, mostrarError } = useAlerta();

  // >>> NUEVO: estados de filtro + orden
  const [filtro, setFiltro] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("fecha_carga"); // por defecto: más recientes
  const [ordenDir, setOrdenDir] = useState("desc");

  // Opciones de orden disponibles
  const opcionesOrden = [
    { value: "fecha_carga", label: "Fecha de carga" },
    { value: "vencimiento", label: "Vencimiento" },
    { value: "promo_hasta", label: "Promo hasta" },
    { value: "monto", label: "Monto" },
    { value: "proveedor", label: "Proveedor" },
    { value: "periodo", label: "Período (mes/año)" },
  ];

  // Simular tiempo de carga para mejor UX
  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 300);
    return () => clearTimeout(timer);
  }, [boletas]);

  // Función para eliminar boleta con confirmación
  const confirmarEliminacion = async () => {
    if (!boletaAEliminar) return;
    try {
      setEliminando(true);
      await eliminarBoletaConImagen(boletaAEliminar);
      mostrarExito("Boleta eliminada correctamente.");
      window.dispatchEvent(new Event("nueva-boleta"));
      recargarBoletas?.();
    } catch (error) {
      mostrarError("Error al eliminar la boleta.");
      console.error(error);
    } finally {
      setEliminando(false);
      setBoletaAEliminar(null);
    }
  };

  // Formatear fecha con tooltip informativo
  const formatearFechaConTooltip = (fechaISO) => {
    if (!fechaISO) return <span className="text-xs text-texto/75">—</span>;

    const fecha = new Date(fechaISO);
    const formatoCorto = fecha.toLocaleDateString("es-AR");
    const formatoLargo = fecha.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return <span title={formatoLargo}>{formatoCorto}</span>;
  };

  // >>> NUEVO: helpers de filtro/orden
  const norm = (v) => (v ?? "").toString().toLowerCase();
  const textoPeriodo = (b) => `${b?.mes ?? ""} ${b?.anio ?? ""}`.trim();
  const valorOrden = (b, campo) => {
    if (campo === "periodo") {
      // año y mes como número (anio-mes) para ordenar correctamente
      const y = Number(b?.anio) || 0;
      const m = Number(b?.mes) || 0;
      return y * 100 + m;
    }
    if (campo === "monto") return Number(b?.monto) || 0;
    if (campo === "proveedor") return norm(b?.proveedor);
    if (campo === "fecha_carga" || campo === "vencimiento" || campo === "promo_hasta") {
      const val = b?.[campo];
      if (!val) return 0;
      // algunos vienen como "YYYY-MM-DD", para tooltip le agregaste T12:00:00 en render; acá no hace falta
      return new Date(val).getTime();
    }
    // fallback: intenta directo
    const v = b?.[campo];
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return new Date(v).getTime();
    return typeof v === "string" ? norm(v) : v;
  };

  // >>> NUEVO: derivar boletas filtradas + ordenadas
  const boletasFiltradas = (boletas ?? []).filter((b) => {
    const f = norm(filtro);
    if (!f) return true;
    return (
      norm(b?.proveedor).includes(f) ||
      norm(textoPeriodo(b)).includes(f) ||
      String(b?.monto ?? "").includes(f)
    );
  });

  const boletasOrdenadas = [...boletasFiltradas].sort((a, b) => {
    const va = valorOrden(a, ordenCampo);
    const vb = valorOrden(b, ordenCampo);
    if (va == null && vb == null) return 0;
    if (va == null) return ordenDir === "asc" ? -1 : 1;
    if (vb == null) return ordenDir === "asc" ? 1 : -1;
    if (va < vb) return ordenDir === "asc" ? -1 : 1;
    if (va > vb) return ordenDir === "asc" ? 1 : -1;
    return 0;
  });

  // Configuración de columnas para la tabla
  const columnas = [
    {
      id: "proveedor",
      label: "PROVEEDOR",
      renderCell: (b) => (
        <div className="font-bold text-texto">
          {b.proveedor || "—"}
        </div>
      ),
    },
    {
      id: "periodo",
      label: "PERÍODO",
      renderCell: (b) => (
        <div className="space-y-1">
          <span className="font-semibold text-texto/75">{b.mes || "—"} {b.anio || "—"}</span>
        </div>
      ),
    },
    {
      id: "monto",
      label: "MONTO",
      renderCell: (b) => (
        <div className="font-bold text-acento">
          ${parseFloat(b.monto || 0).toFixed(2)}
        </div>
      ),
    },
    {
      id: "fechas",
      label: "FECHAS IMPORTANTES",
      renderCell: (b) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-green-700">Carga:</span>
            {formatearFechaConTooltip(b.fecha_carga)}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-red-600">Vence:</span>
            {formatearFechaConTooltip(b.vencimiento ? b.vencimiento + "T12:00:00" : null)}
          </div>
          {b.promo_hasta && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-yellow-600">Promo:</span>
              {formatearFechaConTooltip(b.promo_hasta + "T12:00:00")}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "acciones",
      label: "ACCIONES",
      renderCell: (b) => (
        <div className="flex flex-wrap gap-2 lg:gap-2">
          <MainButton
            onClick={() => setBoletaParaVer(b)}
            title="Ver boleta"
            variant="see"
            iconAlwaysVisible={true}
          >
            <span className="hidden sm:inline">Ver</span>
          </MainButton>
          <MainButton
            onClick={() => setBoletaSeleccionada(b)}
            title="Editar boleta"
            variant="edit"
            iconAlwaysVisible={true}
          >
            <span className="hidden sm:inline">Editar</span>
          </MainButton>
          <MainButton
            onClick={() => setBoletaAEliminar(b)}
            title="Eliminar boleta"
            variant="delete"
            iconAlwaysVisible={true}
          >
            <span className="hidden sm:inline">Eliminar</span>
          </MainButton>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Renderizado condicional según estado de datos */}
      {cargando ? (
        <MainLoader texto="Cargando boletas..." size="large" />
      ) : boletas.length === 0 ? (
        <div className="text-center py-16">
          <MainH3 className="text-center justify-center">
            No tienes boletas cargadas.
          </MainH3>
          <p className="text-texto mb-4">
            Comienza cargando tus boletas para poder verlas aquí.
          </p>
        </div>
      ) : (
        <>
          {/* >>> NUEVO: Filtro + Orden para boletas */}
          <FiltroOrden
            filtro={filtro}
            setFiltro={setFiltro}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenDir={ordenDir}
            setOrdenDir={setOrdenDir}
            opcionesOrden={opcionesOrden}
            placeholder="Buscar por proveedor, período o monto…"
          />

          <Table
            columns={columnas}
            data={boletasOrdenadas}
            // si implementaste header clickeable en Table.jsx:
            ordenCampo={ordenCampo}
            ordenDir={ordenDir}
            onSortChange={(campo, dir) => {
              setOrdenCampo(campo);
              setOrdenDir(dir);
            }}
          />
        </>
      )}

      {/* MODALES*/}
      {/* Modal para ver boleta con navegación */}
      {boletaParaVer &&
        (() => {
          const indexActual = boletasOrdenadas.findIndex(
            (b) => b.id === boletaParaVer.id
          );
          const boletaAnterior = boletasOrdenadas[indexActual + 1] || null;
          return (
            <ModalVerBoleta
              boleta={boletaParaVer}
              boletaAnterior={boletaAnterior}
              onClose={() => setBoletaParaVer(null)}
            />
          );
        })()}

      {/* Modal para editar boleta */}
      {boletaSeleccionada && (
        <ModalEditarBoleta
          boleta={boletaSeleccionada}
          onClose={() => setBoletaSeleccionada(null)}
          onActualizar={recargarBoletas}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {boletaAEliminar && (
        <ModalEliminar
          titulo="boleta"
          descripcion="boleta"
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setBoletaAEliminar(null)}
          loading={eliminando}
        />
      )}
    </div>
  );
};

export default BoletaHistorial;
