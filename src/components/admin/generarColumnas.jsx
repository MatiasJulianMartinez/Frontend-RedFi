import { IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

export const generarColumnas = (tabla, datos, acciones = {}) => {
  // Validación: si no hay datos, retorna array vacío
  if (!datos.length) return [];

  // Obtiene el primer elemento para analizar la estructura de datos
  const ejemplo = datos[0];
  const columnasBase = [];

  // === CONFIGURACIÓN DE COLUMNAS POR TIPO DE TABLA ===

  // 1. TABLA DE PERFILES DE USUARIO
  if (tabla === "user_profiles") {
    columnasBase.push(
      // Columna de avatar del usuario
      {
        id: "avatar",
        label: "AVATAR",
        renderCell: (row) => (
          <Avatar fotoUrl={row.foto_url} nombre={row.nombre} size={8} />
        ),
      },
      // Columna de nombre del usuario
      {
        id: "nombre",
        label: "NOMBRE",
        renderCell: (row) => row.nombre,
      },
      // Columna de proveedor preferido (opcional)
      {
        id: "proveedor_preferido",
        label: "PROVEEDOR PREFERIDO",
        renderCell: (row) =>
          row.proveedor_preferido ? (
            <Badge
              size="xs"
              variant="muted"
              className="truncate max-w-[180px]"
              title={row.proveedor_preferido}
            >
              {row.proveedor_preferido}
            </Badge>
          ) : (
            "—"
          ),
      },
      // Columna combinada de rol y plan del usuario
      // id => "rol" para que el click en header ordene por el rol subyacente
      {
        id: "rol",
        label: "ROL Y PLAN",
        renderCell: (row) => {
          const rol = row.rol;
          const plan = row.plan;
          
          return (
            <div className="flex flex-wrap gap-1 items-center">
              {/* Badge de Rol - Admin destacado con variante especial */}
              {rol ? (
                rol === "admin" ? (
                  <Badge size="xs" variant="admin">
                    {rol.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge size="xs" variant="muted">
                    {rol.toUpperCase()}
                  </Badge>
                )
              ) : null}
              
              {/* Badge de Plan - Premium destacado con variante especial */}
              {plan ? (
                plan === "premium" ? (
                  <Badge size="xs" variant="premium">
                    {plan.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge size="xs" variant="muted">
                    {plan.toUpperCase()}
                  </Badge>
                )
              ) : null}
              
              {/* Texto de fallback si no tiene rol ni plan */}
              {!rol && !plan && "—"}
            </div>
          );
        },
      }
    );
  }

  // 2. TABLA DE PROVEEDORES DE INTERNET
  else if (tabla === "proveedores") {
    columnasBase.push(
      // Columna de logotipo del proveedor
      {
        id: "avatar",
        label: "AVATAR",
        renderCell: (row) => (
          <Avatar fotoUrl={row.logotipo} nombre={row.nombre} size={8} />
        ),
      },
      // Columna de nombre del proveedor
      { 
        id: "nombre", 
        label: "NOMBRE", 
        renderCell: (row) => row.nombre 
      },
      // Columna de descripción del proveedor (truncada para evitar overflow)
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => (
          <div
            className="truncate text-ellipsis overflow-hidden max-w-[200px]"
            title={row.descripcion}
          >
            {row.descripcion || "—"}
          </div>
        ),
      },
      // Columna de sitio web del proveedor (como link clickeable)
      {
        id: "sitio_web",
        label: "SITIO WEB",
        renderCell: (row) => (
          <div
            className="truncate text-ellipsis overflow-hidden max-w-[150px] lg:max-w-none"
            title={row.sitio_web}
          >
            {row.sitio_web ? (
              <a 
                href={row.sitio_web} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-texto/75 hover:underline"
              >
                {/* Remueve https:// o http:// para mostrar URL más limpia */}
                {row.sitio_web.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              "—"
            )}
          </div>
        ),
      },
      // Columna de color representativo del proveedor (muestra como círculo de color)
      {
        id: "color",
        label: "COLOR",
        renderCell: (row) => (
          <div
            className="w-5 h-5 rounded outline-2 outline-offset-0 outline-texto/50"
            style={{ backgroundColor: row.color }}
          />
        ),
      }
    );
  }

  // 3. TABLA DE RESEÑAS DE USUARIOS SOBRE PROVEEDORES
  else if (tabla === "reseñas") {
    columnasBase.push(
      // Columna de usuario que escribió la reseña (nota: nested; el orden por header no aplicará directo)
      {
        id: "user_profiles",
        label: "USUARIOS",
        renderCell: (row) => row.user_profiles?.nombre || "—",
      },
      // Columna de proveedor reseñado (nota: nested)
      {
        id: "proveedores",
        label: "PROVEEDORES",
        renderCell: (row) => row.proveedores?.nombre || "—",
      },
      // Columna de calificación con estrellas (1-5)
      {
        id: "estrellas",
        label: "ESTRELLAS",
        renderCell: (row) => (
          <div className="inline-flex items-center gap-1 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15 w-fit">
            {/* Genera array de 5 estrellas, llenas o vacías según la calificación */}
            {Array.from({ length: 5 }, (_, i) =>
              i < (Number(row.estrellas) || 0) ? (
                <IconCarambolaFilled
                  key={i}
                  size={18}
                  className="text-yellow-600"
                />
              ) : (
                <IconCarambola key={i} size={18} className="text-yellow-600" />
              )
            )}
          </div>
        ),
      },
      // Columna de comentario de la reseña (limitado en líneas)
      {
        id: "comentario",
        label: "COMENTARIO",
        renderCell: (row) => (
          <div
            className="truncate text-ellipsis overflow-hidden max-w-[200px]"
            title={row.comentario}
          >
            {row.comentario || "—"}
          </div>
        ),
      }
    );
  }

  // 4. TABLA DE TECNOLOGÍAS DE CONEXIÓN (Fibra, ADSL, Cable, etc.)
  else if (tabla === "tecnologias") {
    columnasBase.push(
      // Columna de nombre de la tecnología
      {
        id: "tecnologia",
        label: "TECNOLOGÍA",
        renderCell: (row) => row.tecnologia,
      },
      // Columna de descripción de la tecnología
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => (
          <div
            className="truncate text-ellipsis overflow-hidden max-w-[200px]"
            title={row.descripcion}
          >
            {row.descripcion || "—"}
          </div>
        ),
      }
    );
  }

  // 5. TABLA RELACIONAL: PROVEEDOR-TECNOLOGÍA (muchos a muchos)
  else if (tabla === "ProveedorTecnologia") {
    columnasBase.push(
      // Columna de nombre del proveedor
      {
        id: "proveedor", // id mapeado al string agrupado en Admin
        label: "PROVEEDOR",
        renderCell: (row) => row.proveedor || "—",
      },
      // Columna de tecnologías que soporta el proveedor (múltiples badges)
      {
        id: "tecnologias",
        label: "TECNOLOGÍAS",
        renderCell: (row) =>
          Array.isArray(row.tecnologias) && row.tecnologias.length ? (
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {row.tecnologias.map((tec, i) => (
                <Badge key={i} size="xs" variant="muted" rounded="lg">
                  {tec}
                </Badge>
              ))}
            </div>
          ) : (
            "—"
          ),
      }
    );
  }

  // 6. TABLA RELACIONAL: ZONA-PROVEEDOR (muchos a muchos)
  else if (tabla === "ZonaProveedor") {
    columnasBase.push(
      // Columna de nombre del proveedor
      {
        id: "proveedor", // id mapeado al string agrupado en Admin
        label: "PROVEEDOR",
        renderCell: (row) => row.proveedor || "—",
      },
      // Columna de zonas donde opera el proveedor (múltiples badges)
      {
        id: "zonas",
        label: "ZONAS",
        renderCell: (row) =>
          Array.isArray(row.zonas) && row.zonas.length ? (
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {row.zonas.map((zona, i) => (
                <Badge key={i} size="xs" variant="muted" rounded="lg">
                  {zona}
                </Badge>
              ))}
            </div>
          ) : (
            "—"
          ),
      }
    );
  }

  // 7. TABLA DE CURSOS DE LA ACADEMIA RED-FI
  else if (tabla === "cursos") {
    columnasBase.push(
      // Columna de miniatura del curso
      {
        id: "miniatura",
        label: "MINIATURA",
        renderCell: (row) => (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-fondo/5 border border-texto/15">
            {row.miniatura_url ? (
              <img
                src={row.miniatura_url}
                alt={row.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-texto/75 text-xs font-bold">
                SIN
              </div>
            )}
          </div>
        ),
      },
      // Columna de título del curso
      {
        id: "titulo",
        label: "TÍTULO",
        renderCell: (row) => (
          <div className="font-medium text-texto">
            {row.titulo}
          </div>
        ),
      },
      // Columna de descripción del curso (truncada)
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => (
          <div
            className="truncate text-ellipsis overflow-hidden max-w-[250px] text-texto/75"
            title={row.descripcion}
          >
            {row.descripcion || "—"}
          </div>
        ),
      },
      // Columna de video de YouTube
      {
        id: "video_youtube",
        label: "VIDEO",
        renderCell: (row) => {
          if (!row.video_youtube_url) return "—";
          
          // Extraer ID del video de YouTube
          const match = row.video_youtube_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          const videoId = match ? match[1] : null;
          
          return videoId ? (
            <a
              href={row.video_youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-red-600 hover:underline"
              title="Ver en YouTube"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="hidden sm:inline">YouTube</span>
            </a>
          ) : (
            <span className="text-texto/75">URL inválida</span>
          );
        },
      },
    );
  }

  // 8. FALLBACK: TABLA DESCONOCIDA - Generación automática de columnas
  else {
    // Obtiene todas las claves del objeto ejemplo para crear columnas genéricas
    const keys = Object.keys(ejemplo);
    keys.forEach((key) => {
      columnasBase.push({
        id: key,
        label: key.toUpperCase(),
        renderCell: (row) => row[key]?.toString?.() || "—",
      });
    });
  }

  // === COLUMNA DE ACCIONES (común para todas las tablas) ===
  if (acciones.onVer || acciones.onEditar || acciones.onEliminar) {
    columnasBase.push({
      id: "acciones",
      label: "ACCIONES",
      renderCell: (row) => {
        // Oculta el botón "Ver" para tablas relacionales que no necesitan vista de detalle
        const ocultarVer =
          tabla === "ProveedorTecnologia" || tabla === "ZonaProveedor";

        return (
          <div className="flex flex-wrap gap-2 lg:gap-2">
            {/* Botón Ver - Solo si existe callback y no está en lista de exclusión */}
            {!ocultarVer && acciones.onVer && (
              <MainButton
                onClick={() => acciones.onVer(row)}
                title="Ver"
                variant="see"
                iconAlwaysVisible={true}
              >
                <span className="hidden sm:inline">Ver</span>
              </MainButton>
            )}
            {/* Botón Editar - Si existe callback */}
            {acciones.onEditar && (
              <MainButton
                onClick={() => acciones.onEditar(row)}
                title="Editar"
                variant="edit"
                iconAlwaysVisible={true}
              >
                <span className="hidden sm:inline">Editar</span>
              </MainButton>
            )}
            {/* Botón Eliminar - Si existe callback */}
            {acciones.onEliminar && (
              <MainButton
                onClick={() => acciones.onEliminar(row)}
                title="Eliminar"
                variant="delete"
                iconAlwaysVisible={true}
              >
                <span className="hidden sm:inline">Eliminar</span>
              </MainButton>
            )}
          </div>
        );
      },
    });
  }

  // Retorna el array completo de configuraciones de columna
  return columnasBase;
};
