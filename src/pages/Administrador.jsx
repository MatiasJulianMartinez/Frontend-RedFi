import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconSettings } from "@tabler/icons-react"
import { getPerfil } from "../services/perfil/getPerfil";
import {
  obtenerPerfilesAdmin,
  eliminarPerfilPorId,
} from "../services/perfil/adminPerfil";
import { obtenerProveedoresAdmin } from "../services/proveedores/obtenerProveedor";
import { eliminarProveedor } from "../services/proveedores/crudProveedor";
import {
  obtenerReseñasAdmin,
  actualizarReseñaAdmin,
  eliminarReseñaAdmin,
} from "../services/reseñas/adminReseña";
import {
  obtenerTecnologias,
  eliminarTecnologia,
} from "../services/tecnologiaService";

import {
  obtenerProveedorTecnologia,
  eliminarProveedorTecnologia,
} from "../services/relaciones/proveedorTecnologiaService";
import {
  obtenerProveedorZona,
  eliminarProveedorZona,
} from "../services/relaciones/proveedorZonaService";

import {
  obtenerCursos,
  eliminarCurso,
} from "../services/cursos";

import ModalEliminar from "../components/modals/ModalEliminar";

import ModalVerPerfil from "../components/modals/admin/perfiles/ModalVerPerfil";
import ModalEditarPerfil from "../components/modals/admin/perfiles/ModalEditarPerfil";

import ModalAgregarProveedor from "../components/modals/admin/proveedores/ModalAgregarProveedor";
import ModalVerProveedor from "../components/modals/mapa/ModalProveedor";
import ModalEditarProveedor from "../components/modals/admin/proveedores/ModalEditarProveedor";

import ModalVerReseña from "../components/modals/mapa/ModalReseña";
import ModalEditarReseña from "../components/modals/mapa/ModalEditarReseña";

import ModalAgregarTecnologia from "../components/modals/admin/tecnologias/ModalAgregarTecnologia";
import ModalVerTecnologia from "../components/modals/admin/tecnologias/ModalVerTecnologia";
import ModalEditarTecnologia from "../components/modals/admin/tecnologias/ModalEditarTecnologia";

import ModalAgregarProveedorTecnologia from "../components/modals/admin/proveedorTecnologia/ModalAgregarProveedorTecnologia";
import ModalEditarProveedorTecnologia from "../components/modals/admin/proveedorTecnologia/ModalEditarProveedorTecnologia";

import ModalAgregarProveedorZona from "../components/modals/admin/proveedorZona/ModalAgregarProveedorZona";
import ModalEditarProveedorZona from "../components/modals/admin/proveedorZona/ModalEditarProveedorZona";

import ModalAgregarCurso from "../components/modals/admin/cursos/ModalAgregarCurso";
import ModalVerCurso from "../components/modals/admin/cursos/ModalVerCurso";
import ModalEditarCurso from "../components/modals/admin/cursos/ModalEditarCurso";

import Table from "../components/ui/Table";
import MainH1 from "../components/ui/MainH1";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";
import MainLoader from "../components/ui/MainLoader";

import TablaSelector from "../components/admin/TablaSelector";
import { generarColumnas } from "../components/admin/generarColumnas";

import { useAlerta } from "../context/AlertaContext";

// Control reutilizable para filtro + orden
import FiltroOrden from "../components/ui/FiltroOrden";

const tablasDisponibles = [
  { id: "user_profiles", label: "Perfiles" },
  { id: "proveedores", label: "Proveedores" },
  { id: "reseñas", label: "Reseñas" },
  { id: "tecnologias", label: "Tecnologías" },
  { id: "cursos", label: "Cursos Academia" },
  { id: "ProveedorTecnologia", label: "Proveedor y Tecnología" },
  { id: "ZonaProveedor", label: "Proveedor y Zona" },
];

const TABLAS_CON_FILTRO_ORDEN = new Set(["user_profiles", "reseñas"]);

const Administrador = () => {
  useEffect(() => {
    document.title = "Red-Fi | Administración";
  }, []);
  
  const [perfil, setPerfil] = useState(null);
  const [tablaActual, setTablaActual] = useState("user_profiles");
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { mostrarError, mostrarExito } = useAlerta();
  const navigate = useNavigate();

  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [perfilAVer, setPerfilAVer] = useState(null);
  const [perfilAEliminar, setPerfilAEliminar] = useState(null);

  const [proveedorNuevo, setProveedorNuevo] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [proveedorAVer, setProveedorAVer] = useState(null);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

  const [reseñaSeleccionada, setReseñaSeleccionada] = useState(null);
  const [reseñaAVer, setReseñaAVer] = useState(null);
  const [reseñaAEliminar, setReseñaAEliminar] = useState(null);

  const [tecnologiaNueva, setTecnologiaNueva] = useState(false);
  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);
  const [tecnologiaAVer, setTecnologiaAVer] = useState(null);
  const [tecnologiaAEliminar, setTecnologiaAEliminar] = useState(null);

  const [proveedorTecnologiaNuevo, setProveedorTecnologiaNuevo] = useState(false);
  const [proveedorTecnologiaSeleccionado, setProveedorTecnologiaSeleccionado] = useState(null);
  const [proveedorTecnologiaAEliminar, setProveedorTecnologiaAEliminar] = useState(null);

  const [proveedorZonaNuevo, setProveedorZonaNuevo] = useState(false);
  const [proveedorZonaSeleccionado, setProveedorZonaSeleccionado] = useState(null);
  const [proveedorZonaAEliminar, setProveedorZonaAEliminar] = useState(null);

  const [cursoNuevo, setCursoNuevo] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursoAVer, setCursoAVer] = useState(null);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);

  const [eliminando, setEliminando] = useState(false);

  const [todosLosDatos, setTodosLosDatos] = useState({
    user_profiles: [],
    proveedores: [],
    reseñas: [],
    tecnologias: [],
    cursos: [],
  });

  // Estados de filtro/orden
  const [filtro, setFiltro] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // default para Perfiles
  const [ordenDir,   setOrdenDir]   = useState("asc");

  // Reset y defaults según la tabla con FO
  useEffect(() => {
    if (tablaActual === "user_profiles") {
      setFiltro("");
      setOrdenCampo("nombre");
      setOrdenDir("asc");
    } else if (tablaActual === "reseñas") {
      setFiltro("");
      setOrdenCampo("created_at");
      setOrdenDir("desc");
    }
  }, [tablaActual]);

  // Opciones de orden por tabla (solo para las que tienen FO)
  const opcionesOrdenPorTabla = {
    user_profiles: [
      { value: "nombre", label: "Nombre" },
      { value: "email", label: "Email" },
      { value: "created_at", label: "Fecha alta" },
    ],
    reseñas: [
      { value: "created_at", label: "Fecha" },
      { value: "estrellas", label: "Puntuación" },
      { value: "comentario", label: "Comentario" },
    ],
  };
  const opcionesOrden = opcionesOrdenPorTabla[tablaActual] ?? [];

  // Helpers de filtro/orden
  const _norm = (v) => (v ?? "").toString().toLowerCase();

  // Campos genéricos (sirven para Perfiles)
  const _candidateFields = (item) => [
    item.nombre,
    item.email,
    item.descripcion,
    item.categoria,
    item.titulo,
  ];

  const _valueForSort = (obj, key) => {
    const v = obj?.[key];
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
      return new Date(v).getTime();
    }
    return typeof v === "string" ? v.toLowerCase() : v;
  };

  // Orden permitidos por tabla (para ignorar headers no soportados)
  const CAMPOS_ORDEN_PERMITIDOS = {
    user_profiles: new Set(["nombre", "email", "created_at"]),
    reseñas: new Set(["created_at", "estrellas", "comentario"]),
  };

  const acciones = {
    onVer: (row) => {
      if (tablaActual === "user_profiles") {
        setPerfilAVer(row);
      }
      if (tablaActual === "proveedores") {
        setProveedorAVer(row);
      }
      if (tablaActual === "reseñas") {
        setReseñaAVer(row);
      }
      if (tablaActual === "tecnologias") {
        setTecnologiaAVer(row);
      }
      if (tablaActual === "cursos") {
        setCursoAVer(row);
      }
    },
    onEditar: (row) => {
      if (tablaActual === "user_profiles") {
        setPerfilSeleccionado(row);
      }
      if (tablaActual === "proveedores") {
        setProveedorSeleccionado(row);
      }
      if (tablaActual === "reseñas") {
        setReseñaSeleccionada(row);
      }
      if (tablaActual === "tecnologias") {
        setTecnologiaSeleccionada(row);
      }
      if (tablaActual === "cursos") {
        setCursoSeleccionado(row);
      }
      if (tablaActual === "ProveedorTecnologia") {
        setProveedorTecnologiaSeleccionado(row);
      }
      if (tablaActual === "ZonaProveedor") {
        setProveedorZonaSeleccionado(row);
      }
    },
    onEliminar: (row) => {
      if (tablaActual === "user_profiles") {
        setPerfilAEliminar(row);
      }
      if (tablaActual === "proveedores") {
        setProveedorAEliminar(row);
      }
      if (tablaActual === "reseñas") {
        setReseñaAEliminar(row);
      }
      if (tablaActual === "tecnologias") {
        setTecnologiaAEliminar(row);
      }
      if (tablaActual === "cursos") {
        setCursoAEliminar(row);
      }
      if (tablaActual === "ProveedorTecnologia") {
        setProveedorTecnologiaAEliminar(row);
      }
      if (tablaActual === "ZonaProveedor") {
        setProveedorZonaAEliminar(row);
      }
    },
  };

  const precargarDatos = async () => {
    setLoading(true);
    try {
      const [
        perfiles,
        proveedores,
        reseñas,
        tecnologias,
        cursos,
        proveedorTecnologia,
        zonaProveedor,
      ] = await Promise.all([
        obtenerPerfilesAdmin(),
        obtenerProveedoresAdmin(),
        obtenerReseñasAdmin(),
        obtenerTecnologias(),
        obtenerCursos(),
        obtenerProveedorTecnologia(),
        obtenerProveedorZona(),
      ]);

      // Agrupar ProveedorTecnologia
      const agrupadoPorProveedorTecnologia = Object.values(
        proveedorTecnologia.reduce((acc, item) => {
          const id = item.proveedor_id;
          if (!acc[id]) {
            acc[id] = {
              id,
              proveedor: item.proveedores?.nombre || "—",
              tecnologias: [],
            };
          }
          const tec = item.tecnologias?.tecnologia;
          if (tec && !acc[id].tecnologias.includes(tec)) {
            acc[id].tecnologias.push(tec);
          }
          return acc;
        }, {})
      );

      // Agrupar ZonaProveedor
      const agrupadoPorZonaProveedor = Object.values(
        zonaProveedor.reduce((acc, item) => {
          const id = item.proveedor_id;
          if (!acc[id]) {
            acc[id] = {
              id,
              proveedor: item.proveedores?.nombre || "—",
              zonas: [],
            };
          }
          const zona = item.zonas?.departamento;
          if (zona && !acc[id].zonas.includes(zona)) {
            acc[id].zonas.push(zona);
          }
          return acc;
        }, {})
      );

      setTodosLosDatos({
        user_profiles: perfiles,
        proveedores,
        reseñas,
        tecnologias,
        cursos,
        ProveedorTecnologia: agrupadoPorProveedorTecnologia,
        ZonaProveedor: agrupadoPorZonaProveedor,
      });
    } catch (error) {
      mostrarError("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verificarPermisos = async () => {
      setLoadingAuth(true);
      try {
        const p = await getPerfil();
        setPerfil(p);
        setLoadingAuth(false);
        
        if (p.rol !== "admin") {
          navigate("/cuenta", {
            state: {
              alerta: {
                tipo: "error",
                mensaje: "No tienes permisos para acceder a esta vista.",
              },
            },
          });
          return;
        }
        await precargarDatos();
      } catch (error) {
        mostrarError("Error al cargar perfil de usuario.");
        setLoadingAuth(false);
        setLoading(false);
      }
    };

    verificarPermisos();
  }, [navigate]);

  // Mostrar loader mientras se verifica autenticación
  if (loadingAuth) {
    return (
      <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
        <div className="max-w-7xl mx-auto space-y-12">
          <MainLoader texto="Verificando permisos de administrador..." size="large" />
        </div>
      </section>
    );
  }

  // Si no es admin, no mostrar nada (el useEffect ya redirige)
  if (!perfil || perfil.rol !== "admin") {
    return null;
  }

  const datosActuales = todosLosDatos[tablaActual] || [];
  const columnas = generarColumnas(tablaActual, datosActuales, acciones);

  // === Filtrado SOLO para Perfiles y Reseñas ===
  const datosFiltrados = (datosActuales ?? []).filter((item) => {
    if (!TABLAS_CON_FILTRO_ORDEN.has(tablaActual)) return true;

    const f = _norm(filtro);
    if (!f) return true;

    if (tablaActual === "user_profiles") {
      return _candidateFields(item).some((c) => _norm(c).includes(f));
    }

    if (tablaActual === "reseñas") {
      const proveedor = item?.proveedores?.nombre ?? "";
      const usuario = item?.user_profiles?.nombre ?? "";
      const comentario = item?.comentario ?? "";
      const estrellas = String(item?.estrellas ?? "");
      return (
        _norm(proveedor).includes(f) ||
        _norm(usuario).includes(f) ||
        _norm(comentario).includes(f) ||
        estrellas.includes(f)
      );
    }

    return true;
  });

  // === Orden SOLO para Perfiles y Reseñas ===
  const datosOrdenados = [...datosFiltrados].sort((a, b) => {
    if (!TABLAS_CON_FILTRO_ORDEN.has(tablaActual)) return 0;

    // Perfiles: usar helper genérico
    if (tablaActual === "user_profiles") {
      const va = _valueForSort(a, ordenCampo);
      const vb = _valueForSort(b, ordenCampo);
      if (va == null && vb == null) return 0;
      if (va == null) return ordenDir === "asc" ? -1 : 1;
      if (vb == null) return ordenDir === "asc" ? 1 : -1;
      if (va < vb) return ordenDir === "asc" ? -1 : 1;
      if (va > vb) return ordenDir === "asc" ? 1 : -1;
      return 0;
    }

    // Reseñas: ordenar por campos concretos
    if (tablaActual === "reseñas") {
      const getVal = (row) => {
        if (ordenCampo === "created_at") {
          const t = row?.created_at || row?.fecha || row?.updated_at;
          return t ? new Date(t).getTime() : 0;
        }
        if (ordenCampo === "estrellas") return Number(row?.estrellas) || 0;
        if (ordenCampo === "comentario") return _norm(row?.comentario);
        return 0;
      };
      const va = getVal(a);
      const vb = getVal(b);
      if (va < vb) return ordenDir === "asc" ? -1 : 1;
      if (va > vb) return ordenDir === "asc" ? 1 : -1;
      return 0;
    }

    return 0;
  });

  // Array final a la tabla (solo FO en perfiles y reseñas)
  const datosParaTabla = TABLAS_CON_FILTRO_ORDEN.has(tablaActual)
    ? datosOrdenados
    : datosActuales;

  // Placeholder de búsqueda por tabla
  const placeholderFO = tablaActual === "user_profiles"
    ? "Buscar en perfiles…"
    : tablaActual === "reseñas"
    ? "Buscar en reseñas…"
    : `Buscar…`;

  return (
    <section className="self-start py-16 px-4 sm:px-6 text-texto w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <MainH1 icon={IconSettings}>Panel de administración</MainH1>
          <p className="text-lg">
            Visualiza los datos de todas las tablas del sistema.
          </p>
        </div>

        {loading ? (
          <MainLoader texto="Cargando datos del sistema..." size="large" />
        ) : (
          <>
            <TablaSelector
              tablas={tablasDisponibles}
              tablaActual={tablaActual}
              setTablaActual={setTablaActual}
            />

            {/* Mostrar Filtro + Orden SOLO en Perfiles y Reseñas */}
            {TABLAS_CON_FILTRO_ORDEN.has(tablaActual) && (
              <FiltroOrden
                filtro={filtro}
                setFiltro={setFiltro}
                ordenCampo={ordenCampo}
                setOrdenCampo={setOrdenCampo}
                ordenDir={ordenDir}
                setOrdenDir={setOrdenDir}
                opcionesOrden={opcionesOrden}
                placeholder={placeholderFO}
              />
            )}

            <div className="flex justify-center mb-4">{tablaActual === "proveedores" && (
            <MainButton onClick={() => setProveedorNuevo(true)} variant="add">
              Agregar Proveedor
            </MainButton>
          )}
          {tablaActual === "tecnologias" && (
            <MainButton onClick={() => setTecnologiaNueva(true)} variant="add">
              Agregar Tecnología
            </MainButton>
          )}
          {tablaActual === "cursos" && (
            <MainButton onClick={() => setCursoNuevo(true)} variant="add">
              Agregar Curso
            </MainButton>
          )}
          {tablaActual === "ProveedorTecnologia" && (
            <MainButton
              onClick={() => setProveedorTecnologiaNuevo(true)}
              variant="add"
            >
              Asignar Tecnologías
            </MainButton>
          )}
          {tablaActual === "ZonaProveedor" && (
            <MainButton onClick={() => setProveedorZonaNuevo(true)} variant="add">
              Asignar Zonas
            </MainButton>
          )}

        </div>

            {/* Pasamos props de orden SOLO en Perfiles y Reseñas */}
            <Table
              columns={columnas}
              data={datosParaTabla}
              {...(TABLAS_CON_FILTRO_ORDEN.has(tablaActual)
                ? {
                    ordenCampo,
                    ordenDir,
                    onSortChange: (campo, dir) => {
                      const permitidos = CAMPOS_ORDEN_PERMITIDOS[tablaActual];
                      if (!permitidos?.has(campo)) return; // ignorar headers no soportados
                      setOrdenCampo(campo);
                      setOrdenDir(dir);
                    },
                  }
                : {})}
            />

            <div className="text-center mt-6">
              <MainLinkButton to="/" variant="secondary">
                <IconArrowLeft />
                Volver al inicio
              </MainLinkButton>
            </div>
          </>
        )}

        {/* === MODALES === */}

        {/* Perfiles */}
        {/* Ver */}
        {tablaActual === "user_profiles" && perfilAVer && (
          <ModalVerPerfil
            perfil={perfilAVer}
            onClose={() => setPerfilAVer(null)}
          />
        )}
        {/* Editar */}
        {tablaActual === "user_profiles" && perfilSeleccionado && (
          <ModalEditarPerfil
            perfil={perfilSeleccionado}
            onClose={() => setPerfilSeleccionado(null)}
            onActualizar={precargarDatos}
          />
        )}
        {/* Eliminar */}
        {tablaActual === "user_profiles" && perfilAEliminar && (
          <ModalEliminar
            titulo="perfil"
            descripcion="perfil"
            loading={eliminando}
            onCancelar={() => setPerfilAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarPerfilPorId(perfilAEliminar.id, mostrarError);
                mostrarExito("Perfil eliminado con éxito.");
                setPerfilAEliminar(null);
                precargarDatos();
              } catch (error) {
                mostrarError("Error al eliminar perfil: " + error.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}
        {/* Proveedores */}
        {/* Agregar */}
        {tablaActual === "proveedores" && proveedorNuevo && (
          <ModalAgregarProveedor
            onClose={() => setProveedorNuevo(false)}
            onActualizar={async () => {
              setProveedorNuevo(false);
              await precargarDatos();
            }}
          />
        )}

        {/* Ver */}
        {tablaActual === "proveedores" && proveedorAVer && (
          <ModalVerProveedor
            proveedor={proveedorAVer}
            onClose={() => setProveedorAVer(null)}
          />
        )}
        {/* Editar */}
        {tablaActual === "proveedores" && proveedorSeleccionado && (
          <ModalEditarProveedor
            proveedor={proveedorSeleccionado}
            onClose={() => setProveedorSeleccionado(null)}
            onActualizar={precargarDatos}
          />
        )}
        {/* Eliminar */}
        {tablaActual === "proveedores" && proveedorAEliminar && (
          <ModalEliminar
            titulo="proveedor"
            descripcion="proveedor"
            loading={eliminando}
            onCancelar={() => setProveedorAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarProveedor(proveedorAEliminar.id, mostrarError);
                mostrarExito("Proveedor eliminado correctamente");
                setProveedorAEliminar(null);
                await precargarDatos();
              } catch (e) {
                mostrarError("Error al eliminar proveedor: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}

        {/* Reseñas */}
        {/* Ver */}
        {tablaActual === "reseñas" && reseñaAVer && (
          <ModalVerReseña
            reseña={reseñaAVer}
            onClose={() => setReseñaAVer(null)}
          />
        )}
        {/* Editar */}
        {tablaActual === "reseñas" && reseñaSeleccionada && (
          <ModalEditarReseña
            isOpen={!!reseñaSeleccionada}
            reseña={reseñaSeleccionada}
            onClose={() => setReseñaSeleccionada(null)}
            onSave={async (datosActualizados) => {
              try {
                await actualizarReseñaAdmin(
                  reseñaSeleccionada.id,
                  datosActualizados,
                  mostrarError
                );
                mostrarExito("Reseña actualizada correctamente");
                await precargarDatos();
                setReseñaSeleccionada(null);
              } catch (e) {
                mostrarError("Error al actualizar reseña: " + e.message);
              }
            }}
          />
        )}
        {/* Eliminar */}
        {tablaActual === "reseñas" && reseñaAEliminar && (
          <ModalEliminar
            titulo="reseña"
            descripcion="reseña"
            loading={eliminando}
            onCancelar={() => setReseñaAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarReseñaAdmin(reseñaAEliminar.id, mostrarError);
                mostrarExito("Reseña eliminada correctamente");
                setReseñaAEliminar(null);
                await precargarDatos();
              } catch (e) {
                mostrarError("Error al eliminar reseña: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}

        {/* Tecnologías */}
        {/* Agregar */}
        {tablaActual === "tecnologias" && tecnologiaNueva && (
          <ModalAgregarTecnologia
            onClose={() => setTecnologiaNueva(false)}
            onActualizar={precargarDatos}
          />
        )}

        {/* Ver */}
        {tablaActual === "tecnologias" && tecnologiaAVer && (
          <ModalVerTecnologia
            tecnologia={tecnologiaAVer}
            onClose={() => setTecnologiaAVer(null)}
          />
        )}
        {/* Editar */}
        {tablaActual === "tecnologias" && tecnologiaSeleccionada && (
          <ModalEditarTecnologia
            tecnologia={tecnologiaSeleccionada}
            onClose={() => setTecnologiaSeleccionada(null)}
            onActualizar={precargarDatos}
          />
        )}
        {/* Eliminar */}
        {tablaActual === "tecnologias" && tecnologiaAEliminar && (
          <ModalEliminar
            titulo="tecnología"
            descripcion="tecnología"
            loading={eliminando}
            onCancelar={() => setTecnologiaAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarTecnologia(tecnologiaAEliminar.id, mostrarError);
                setTecnologiaAEliminar(null);
                mostrarExito("Tecnología eliminada con éxito.");
                await precargarDatos();
              } catch (e) {
                console.error("Error al eliminar tecnología: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}
        {/* Proveedor y Tecnología */}
        {/* Agregar */}
        {tablaActual === "ProveedorTecnologia" && proveedorTecnologiaNuevo && (
          <ModalAgregarProveedorTecnologia
            onClose={() => setProveedorTecnologiaNuevo(false)}
            onActualizar={async () => {
              setProveedorTecnologiaNuevo(false);
              await precargarDatos();
            }}
          />
        )}
        {/* Editar */}
        {tablaActual === "ProveedorTecnologia" &&
          proveedorTecnologiaSeleccionado && (
            <ModalEditarProveedorTecnologia
              proveedor={proveedorTecnologiaSeleccionado}
              onClose={() => setProveedorTecnologiaSeleccionado(null)}
              onActualizar={precargarDatos}
            />
          )}
        {/* Eliminar */}
        {tablaActual === "ProveedorTecnologia" &&
          proveedorTecnologiaAEliminar && (
            <ModalEliminar
              titulo="vinculación"
              descripcion="vinculación"
              loading={eliminando}
              onCancelar={() => setProveedorTecnologiaAEliminar(null)}
              onConfirmar={async () => {
                setEliminando(true);
                try {
                  await eliminarProveedorTecnologia(
                    proveedorTecnologiaAEliminar.id,
                    mostrarError
                  );
                  mostrarExito("Vinculación eliminada correctamente.");
                  setProveedorTecnologiaAEliminar(null);
                  await precargarDatos();
                } catch (e) {
                  mostrarError("Error al eliminar relación: " + e.message);
                } finally {
                  setEliminando(false);
                }
              }}
            />
          )}
        {/* Proveedor y Zona */}
        {/* Agregar */}
        {tablaActual === "ZonaProveedor" && proveedorZonaNuevo && (
          <ModalAgregarProveedorZona
            onClose={() => setProveedorZonaNuevo(false)}
            onActualizar={async () => {
              setProveedorZonaNuevo(false);
              await precargarDatos();
            }}
          />
        )}

        {/* Editar */}
        {tablaActual === "ZonaProveedor" && proveedorZonaSeleccionado && (
          <ModalEditarProveedorZona
            proveedor={proveedorZonaSeleccionado}
            onClose={() => setProveedorZonaSeleccionado(null)}
            onActualizar={precargarDatos}
          />
        )}
        {/* Eliminar */}
        {tablaActual === "ZonaProveedor" && proveedorZonaAEliminar && (
          <ModalEliminar
            titulo="cobertura"
            descripcion="cobertura"
            loading={eliminando}
            onCancelar={() => setProveedorZonaAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarProveedorZona(
                  proveedorZonaAEliminar.id,
                  mostrarError
                );
                mostrarExito("Cobertura eliminada correctamente.");
                setProveedorZonaAEliminar(null);
                await precargarDatos();
              } catch (e) {
                mostrarError("Error al eliminar relación: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}

        {/* Cursos Academia */}
        {/* Agregar */}
        {tablaActual === "cursos" && cursoNuevo && (
          <ModalAgregarCurso
            onClose={() => setCursoNuevo(false)}
            onActualizar={async () => {
              setCursoNuevo(false);
              await precargarDatos();
            }}
          />
        )}

        {/* Ver */}
        {tablaActual === "cursos" && cursoAVer && (
          <ModalVerCurso
            curso={cursoAVer}
            onClose={() => setCursoAVer(null)}
          />
        )}
        
        {/* Editar */}
        {tablaActual === "cursos" && cursoSeleccionado && (
          <ModalEditarCurso
            curso={cursoSeleccionado}
            onClose={() => setCursoSeleccionado(null)}
            onActualizar={async () => {
              setCursoSeleccionado(null);
              await precargarDatos();
            }}
          />
        )}
        
        {/* Eliminar */}
        {tablaActual === "cursos" && cursoAEliminar && (
          <ModalEliminar
            titulo="curso"
            descripcion="curso"
            loading={eliminando}
            onCancelar={() => setCursoAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarCurso(cursoAEliminar.id);
                mostrarExito("Curso eliminado correctamente.");
                setCursoAEliminar(null);
                await precargarDatos();
              } catch (e) {
                mostrarError("Error al eliminar curso: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}
      </div>
    </section>
  );
};

export default Administrador;
