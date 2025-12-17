import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowBack, IconSettings, IconCirclePlus } from "@tabler/icons-react";
import { getPerfil } from "../services/perfil/getPerfil";
import { obtenerPerfilesAdmin } from "../services/perfil/adminPerfil";
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

import { obtenerCursos, eliminarCurso } from "../services/cursos";

import { eliminarUsuarioCompleto } from "../services/perfil/adminPerfil";

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
import ModalMapa from "../components/modals/admin/proveedorZona/ModalMapa";

import ModalAgregarCurso from "../components/modals/admin/cursos/ModalAgregarCurso";
import ModalVerCurso from "../components/modals/admin/cursos/ModalVerCurso";
import ModalEditarCurso from "../components/modals/admin/cursos/ModalEditarCurso";

import ModalAgregarPerfil from "../components/modals/admin/perfiles/ModalAgregarPerfil";

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

const TABLAS_CON_FILTRO_ORDEN = new Set([
  "user_profiles",
  "reseñas",
  "proveedores",
  "tecnologias",
  "cursos",
  "ProveedorTecnologia",
  "ZonaProveedor",
]);

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

  const [proveedorTecnologiaNuevo, setProveedorTecnologiaNuevo] =
    useState(false);
  const [proveedorTecnologiaSeleccionado, setProveedorTecnologiaSeleccionado] =
    useState(null);
  const [proveedorTecnologiaAEliminar, setProveedorTecnologiaAEliminar] =
    useState(null);

  const [proveedorZonaNuevo, setProveedorZonaNuevo] = useState(false);
  const [proveedorZonaSeleccionado, setProveedorZonaSeleccionado] =
    useState(null);
  const [proveedorZonaAEliminar, setProveedorZonaAEliminar] = useState(null);

  const [cursoNuevo, setCursoNuevo] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursoAVer, setCursoAVer] = useState(null);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);

  const [usuarioNuevo, setUsuarioNuevo] = useState(false);

  // Estado para modal de mapa de zona
  const [zonaParaMapa, setZonaParaMapa] = useState(null);

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
  const [ordenCampo, setOrdenCampo] = useState("nombre_usuario"); // default para Perfiles
  const [ordenDir, setOrdenDir] = useState("asc");

  // Reset y defaults según la tabla con FO
  useEffect(() => {
    if (tablaActual === "user_profiles") {
      setFiltro("");
      setOrdenCampo("nombre_usuario");
      setOrdenDir("asc");
    } else if (tablaActual === "reseñas") {
      setFiltro("");
      setOrdenCampo("user_profiles");
      setOrdenDir("asc");
    } else if (tablaActual === "proveedores") {
      setFiltro("");
      setOrdenCampo("nombre_proveedor");
      setOrdenDir("asc");
    } else if (tablaActual === "tecnologias") {
      setFiltro("");
      setOrdenCampo("tecnologia");
      setOrdenDir("asc");
    } else if (tablaActual === "cursos") {
      setFiltro("");
      setOrdenCampo("titulo");
      setOrdenDir("asc");
    } else if (tablaActual === "ProveedorTecnologia") {
      setFiltro("");
      setOrdenCampo("proveedor_tecnologia");
      setOrdenDir("asc");
    } else if (tablaActual === "ZonaProveedor") {
      setFiltro("");
      setOrdenCampo("proveedor_zona");
      setOrdenDir("asc");
    }
  }, [tablaActual]);

  // Opciones de orden por tabla (solo para las que tienen FO)
  const opcionesOrdenPorTabla = {
    user_profiles: [
      { value: "nombre_usuario", label: "Nombre" },
      { value: "proveedor_preferido", label: "Proveedor preferido" },
      { value: "rol", label: "Rol" },
      { value: "plan", label: "Plan" },
    ],
    reseñas: [
      { value: "user_profiles", label: "Nombre" },
      { value: "proveedores", label: "Proveedores" },
      { value: "estrellas", label: "Estrellas" },
      { value: "comentario", label: "Comentario" },
    ],
    proveedores: [{ value: "nombre_proveedor", label: "Nombre" }],
    tecnologias: [{ value: "tecnologia", label: "Tecnología" }],
    cursos: [{ value: "titulo", label: "Título" }],
    ProveedorTecnologia: [
      { value: "proveedor_tecnologia", label: "Proveedor" },
      { value: "tecnologias", label: "Tecnologías" },
    ],
    ZonaProveedor: [
      { value: "proveedor_zona", label: "Proveedor" },
      { value: "zonas", label: "Zonas" },
    ],
  };
  const opcionesOrden = opcionesOrdenPorTabla[tablaActual] ?? [];

  // Helpers de filtro/orden
  const _norm = (v) => (v ?? "").toString().toLowerCase();

  // Campos genéricos (sirven para Perfiles)
  const _candidateFields = (item) => [
    item.nombre,
    item.proveedor_preferido,
    item.rol,
    item.plan,
    item.descripcion,
    item.categoria,
    item.titulo,
  ];

  const _valueForSort = (obj, key) => {
    // Mapear IDs de columna a nombres de campo reales en los datos
    const fieldMap = {
      nombre_usuario: "nombre",
      nombre_proveedor: "nombre",
      proveedor_tecnologia: "proveedor",
      proveedor_zona: "proveedor",
    };
    
    // Usar el campo mapeado si existe, sino usar la key original
    const actualField = fieldMap[key] || key;
    const v = obj?.[actualField];

    // Lógica especial para rol: admin primero en orden ascendente
    if (key === "rol") {
      if (v === "admin") return "0_admin"; // Admin va primero
      return v ? `1_${v.toLowerCase()}` : "2_sin_rol";
    }

    // Lógica especial para plan: premium primero en orden ascendente
    if (key === "plan") {
      if (v === "premium") return "0_premium"; // Premium va primero
      return v ? `1_${v.toLowerCase()}` : "2_sin_plan";
    }

    // Lógica especial para proveedor_preferido: ordenar alfabéticamente, sin preferido al final
    if (key === "proveedor_preferido") {
      return v ? v.toLowerCase() : "zzz_sin_proveedor";
    }

    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
      return new Date(v).getTime();
    }
    return typeof v === "string" ? v.toLowerCase() : v;
  };

  // Orden permitidos por tabla (para ignorar headers no soportados)
  const CAMPOS_ORDEN_PERMITIDOS = {
    user_profiles: new Set(["nombre_usuario", "proveedor_preferido", "rol", "plan"]),
    reseñas: new Set(["user_profiles", "proveedores", "estrellas", "comentario"]),
    proveedores: new Set(["nombre_proveedor"]),
    tecnologias: new Set(["tecnologia"]),
    cursos: new Set(["titulo"]),
    ProveedorTecnologia: new Set(["proveedor_tecnologia", "tecnologias"]),
    ZonaProveedor: new Set(["proveedor_zona", "zonas"]),
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
    onVerMapa: (zona) => {
      setZonaParaMapa(zona);
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
          const tec = item.tecnologias;
          if (tec && !acc[id].tecnologias.find((t) => t.id === tec.id)) {
            acc[id].tecnologias.push({
              id: tec.id,
              nombre: tec.tecnologia,
              descripcion: tec.descripcion,
            });
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
              zonasCompletas: [], // Guardar objetos completos para el mapa
            };
          }
          const zonaNombre = item.zonas?.departamento;
          const zonaCompleta = item.zonas;
          if (zonaNombre && !acc[id].zonas.includes(zonaNombre)) {
            acc[id].zonas.push(zonaNombre);
          }
          if (
            zonaCompleta &&
            !acc[id].zonasCompletas.find((z) => z.id === zonaCompleta.id)
          ) {
            acc[id].zonasCompletas.push(zonaCompleta);
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
          <MainLoader
            texto="Verificando permisos de administrador..."
            size="large"
          />
        </div>
      </section>
    );
  }

  // Si no es admin, no mostrar nada (el useEffect ya redirige)
  if (!perfil || perfil.rol !== "admin") {
    return null;
  }

  const datosActuales = todosLosDatos[tablaActual] || [];
  const columnas = generarColumnas(
    tablaActual,
    datosActuales,
    acciones,
    perfil
  );

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

    if (tablaActual === "proveedores") {
      const nombre = item?.nombre ?? "";
      return _norm(nombre).includes(f);
    }

    if (tablaActual === "tecnologias") {
      const tecnologia = item?.tecnologia ?? "";
      return _norm(tecnologia).includes(f);
    }

    if (tablaActual === "cursos") {
      const titulo = item?.titulo ?? "";
      return _norm(titulo).includes(f);
    }

    if (tablaActual === "ProveedorTecnologia") {
      const proveedor = item?.proveedor ?? "";
      const tecnologias = (item?.tecnologias || []).join(" ");
      return _norm(proveedor).includes(f) || _norm(tecnologias).includes(f);
    }

    if (tablaActual === "ZonaProveedor") {
      const proveedor = item?.proveedor ?? "";
      const zonas = (item?.zonas || []).join(" ");
      return _norm(proveedor).includes(f) || _norm(zonas).includes(f);
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
        if (ordenCampo === "user_profiles") {
          const nombre = row?.user_profiles?.nombre || "";
          return _norm(nombre);
        }
        if (ordenCampo === "proveedores") {
          const proveedor = row?.proveedores?.nombre || "";
          return _norm(proveedor);
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

    // Proveedores: ordenar por nombre
    if (tablaActual === "proveedores") {
      const va = _norm(a?.nombre || "");
      const vb = _norm(b?.nombre || "");
      if (va < vb) return ordenDir === "asc" ? -1 : 1;
      if (va > vb) return ordenDir === "asc" ? 1 : -1;
      return 0;
    }

    // Tecnologías: ordenar por tecnologia
    if (tablaActual === "tecnologias") {
      const va = _norm(a?.tecnologia || "");
      const vb = _norm(b?.tecnologia || "");
      if (va < vb) return ordenDir === "asc" ? -1 : 1;
      if (va > vb) return ordenDir === "asc" ? 1 : -1;
      return 0;
    }

    // Cursos: ordenar por titulo
    if (tablaActual === "cursos") {
      const va = _norm(a?.titulo || "");
      const vb = _norm(b?.titulo || "");
      if (va < vb) return ordenDir === "asc" ? -1 : 1;
      if (va > vb) return ordenDir === "asc" ? 1 : -1;
      return 0;
    }

    // ProveedorTecnologia: ordenar por proveedor o tecnologias
    if (tablaActual === "ProveedorTecnologia") {
      let va, vb;
      if (ordenCampo === "proveedor_tecnologia") {
        va = _norm(a?.proveedor || "");
        vb = _norm(b?.proveedor || "");
      } else if (ordenCampo === "tecnologias") {
        va = _norm((a?.tecnologias || []).join(", "));
        vb = _norm((b?.tecnologias || []).join(", "));
      }
      if (va < vb) return ordenDir === "asc" ? -1 : 1;
      if (va > vb) return ordenDir === "asc" ? 1 : -1;
      return 0;
    }

    // ZonaProveedor: ordenar por proveedor o zonas
    if (tablaActual === "ZonaProveedor") {
      let va, vb;
      if (ordenCampo === "proveedor_zona") {
        va = _norm(a?.proveedor || "");
        vb = _norm(b?.proveedor || "");
      } else if (ordenCampo === "zonas") {
        va = _norm((a?.zonas || []).join(", "));
        vb = _norm((b?.zonas || []).join(", "));
      }
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
  const placeholderFO =
    tablaActual === "user_profiles"
      ? "Buscar en perfiles…"
      : tablaActual === "reseñas"
      ? "Buscar en reseñas…"
      : tablaActual === "proveedores"
      ? "Buscar por nombre de proveedor…"
      : tablaActual === "tecnologias"
      ? "Buscar por nombre de tecnología…"
      : tablaActual === "cursos"
      ? "Buscar por título del curso…"
      : tablaActual === "ProveedorTecnologia"
      ? "Buscar por proveedor o tecnología…"
      : tablaActual === "ZonaProveedor"
      ? "Buscar por proveedor o zona…"
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

            <div className="flex justify-center mb-4">
              {tablaActual === "proveedores" && (
                <MainButton
                  onClick={() => setProveedorNuevo(true)}
                  variant="add"
                >
                  Agregar Proveedor
                </MainButton>
              )}
              {tablaActual === "user_profiles" && (
                <MainButton onClick={() => setUsuarioNuevo(true)} variant="add">
                  Agregar Usuario
                </MainButton>
              )}
              {tablaActual === "reseñas" && (
                <MainButton
                  onClick={() => navigate("/mapa")}
                  variant="accent"
                >
                  <IconCirclePlus />
                  Agregar Reseña
                </MainButton>
              )}
              {tablaActual === "tecnologias" && (
                <MainButton
                  onClick={() => setTecnologiaNueva(true)}
                  variant="add"
                >
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
                <MainButton
                  onClick={() => setProveedorZonaNuevo(true)}
                  variant="add"
                >
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
                <IconArrowBack />
                Volver al inicio
              </MainLinkButton>
            </div>
          </>
        )}

        {/* === MODALES === */}

        {/* Perfiles */}
        {tablaActual === "user_profiles" && usuarioNuevo && (
          <ModalAgregarPerfil
            onClose={() => setUsuarioNuevo(false)}
            onActualizar={async () => {
              setUsuarioNuevo(false);
              await precargarDatos();
            }}
          />
        )}
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
            titulo="usuario"
            descripcion="usuario y todas sus reseñas"
            loading={eliminando}
            onCancelar={() => setPerfilAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarUsuarioCompleto(perfilAEliminar.id);
                mostrarExito("Usuario eliminado correctamente.");
                setPerfilAEliminar(null);
                await precargarDatos();
              } catch (error) {
                mostrarError("Error al eliminar usuario: " + error.message);
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
                console.error("Error al actualizar reseña:", e);
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

        {/* Modal de mapa para visualizar zonas */}
        {zonaParaMapa && (
          <ModalMapa
            zona={zonaParaMapa}
            onClose={() => setZonaParaMapa(null)}
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
          <ModalVerCurso curso={cursoAVer} onClose={() => setCursoAVer(null)} />
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
