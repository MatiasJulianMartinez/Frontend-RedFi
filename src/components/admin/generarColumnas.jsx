import { IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

export const generarColumnas = (tabla, datos, acciones = {}) => {
  if (!datos.length) return [];

  const ejemplo = datos[0];
  const columnasBase = [];

  // 1. Perfiles
  if (tabla === "user_profiles") {
    columnasBase.push(
      {
        id: "avatar",
        label: "AVATAR",
        renderCell: (row) => (
          <Avatar fotoUrl={row.foto_url} nombre={row.nombre} size={8} />
        ),
      },
      {
        id: "nombre",
        label: "NOMBRE",
        renderCell: (row) => row.nombre,
      },
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
      {
        id: "rol_y_plan",
        label: "ROL Y PLAN",
        renderCell: (row) => {
          const rol = row.rol;
          const plan = row.plan;
          
          return (
            <div className="flex flex-wrap gap-1 items-center">
              {/* Badge de Rol */}
              {rol ? (
                rol === "admin" ? (
                  <Badge
                    size="xs"
                    bgClass="bg-acento"
                    textClass="text-texto"
                    className="font-bold"
                  >
                    {rol.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge size="xs" variant="muted" className="font-bold">
                    {rol.toUpperCase()}
                  </Badge>
                )
              ) : null}
              
              {/* Badge de Plan */}
              {plan ? (
                plan === "premium" ? (
                  <Badge
                    size="xs"
                    bgClass="bg-acento"
                    textClass="text-texto"
                    className="font-bold"
                  >
                    {plan.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge size="xs" variant="muted" className="font-bold">
                    {plan.toUpperCase()}
                  </Badge>
                )
              ) : null}
              
              {/* Fallback si no hay rol ni plan */}
              {!rol && !plan && "—"}
            </div>
          );
        },
      }
    );
  }

  // 2. Proveedores
  else if (tabla === "proveedores") {
    columnasBase.push(
      {
        id: "avatar",
        label: "AVATAR",
        renderCell: (row) => (
          <Avatar fotoUrl={row.logotipo} nombre={row.nombre} size={8} />
        ),
      },
      { id: "nombre", label: "NOMBRE", renderCell: (row) => row.nombre },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => (
          <div
            className="truncate text-ellipsis overflow-hidden max-w-[200px] lg:max-w-none"
            title={row.descripcion}
          >
            {row.descripcion || "—"}
          </div>
        ),
      },
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
                className="text-primario hover:underline"
              >
                {row.sitio_web.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              "—"
            )}
          </div>
        ),
      },
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

  // 3. Reseñas
  else if (tabla === "reseñas") {
    columnasBase.push(
      {
        id: "user_profiles",
        label: "USUARIOS",
        renderCell: (row) => row.user_profiles?.nombre || "—",
      },
      {
        id: "proveedores",
        label: "PROVEEDORES",
        renderCell: (row) => row.proveedores?.nombre || "—",
      },
      {
        id: "estrellas",
        label: "ESTRELLAS",
        renderCell: (row) => (
          <div className="inline-flex items-center gap-1 bg-texto/5 font-bold px-3 py-1 rounded-full border border-texto/15 w-fit">
            {Array.from({ length: 5 }, (_, i) =>
              i < row.estrellas ? (
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
      {
        id: "comentario",
        label: "COMENTARIO",
        renderCell: (row) => (
          <div
            className="line-clamp-2 text-ellipsis overflow-hidden max-w-[250px] lg:max-w-none leading-relaxed"
            title={row.comentario}
          >
            {row.comentario || "—"}
          </div>
        ),
      }
    );
  }

  // 4. Tecnologías
  else if (tabla === "tecnologias") {
    columnasBase.push(
      {
        id: "tecnologia",
        label: "TECNOLOGÍA",
        renderCell: (row) => row.tecnologia,
      },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => row.descripcion || "—",
      }
    );
  }

  // 5. Proveedor y Tecnología
  else if (tabla === "ProveedorTecnologia") {
    columnasBase.push(
      {
        id: "proveedor_id",
        label: "PROVEEDOR",
        renderCell: (row) => row.proveedor || "—",
      },
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

  // 6. Proveedor y Zona
  else if (tabla === "ZonaProveedor") {
    columnasBase.push(
      {
        id: "proveedor_id",
        label: "PROVEEDOR",
        renderCell: (row) => row.proveedor || "—",
      },
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

  // 7. Fallback para tablas desconocidas
  else {
    const keys = Object.keys(ejemplo);
    keys.forEach((key) => {
      columnasBase.push({
        id: key,
        label: key.toUpperCase(),
        renderCell: (row) => row[key]?.toString?.() || "—",
      });
    });
  }

  // Acciones (común para todas)
  if (acciones.onVer || acciones.onEditar || acciones.onEliminar) {
    columnasBase.push({
      id: "acciones",
      label: "ACCIONES",
      renderCell: (row) => {
        const ocultarVer =
          tabla === "ProveedorTecnologia" || tabla === "ZonaProveedor";

        return (
          <div className="flex flex-wrap gap-2 lg:gap-2">
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

  return columnasBase;
};