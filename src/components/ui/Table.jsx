import classNames from "classnames";
import { useTheme } from "../../context/ThemeContext";

const Table = ({
  columns = [],
  data = [],
  className = "",
  // NUEVO (opcionales):
  ordenCampo,
  ordenDir = "asc",
  onSortChange,
}) => {
  const { currentTheme } = useTheme();

  // helper para renderizar flechita de orden
  const sortIndicator = (colId) => {
    if (!ordenCampo || ordenCampo !== colId) return null;
    return (
      <span className="ml-1 select-none opacity-70">
        {ordenDir === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  // handler de click en header (si nos pasaron onSortChange)
  const handleHeaderClick = (col) => {
    if (!onSortChange) return;
    if (col.id === "acciones") return; // nunca ordenar por acciones
    // si clickean la misma col, alternamos dir; si no, arrancamos asc
    const nextDir =
      ordenCampo === col.id ? (ordenDir === "asc" ? "desc" : "asc") : "asc";
    onSortChange(col.id, nextDir);
  };

  const headerBaseClasses =
    "px-6 py-4 text-left text-sm font-bold text-texto uppercase tracking-wider";
  const headerClickableClasses =
    "cursor-pointer hover:bg-texto/10 transition-colors";

  return (
    <>
      {/* Vista de escritorio */}
      <div
        className={classNames(
          `hidden lg:block backdrop-blur-md bg-secundario shadow-lg rounded-lg overflow-hidden ${
            currentTheme === "light"
              ? "border-2 border-texto/15"
              : "border border-secundario/50"
          }`,
          className
        )}
      >
        <table className="w-full">
          <thead className="bg-texto/5">
            <tr>
              {columns.map((col) => {
                const clickable = !!onSortChange && col.id !== "acciones" && col.id !== "mapa" && col.id !== "miniatura" && col.id !== "descripcion_curso" && col.id !== "video_curso" && col.id !== "avatar_usuario" && col.id !== "avatar_proveedor" && col.id !== "descripcion_proveedor" && col.id !== "sitio_web" && col.id !== "color" && col.id !== "descripcion_tecnologia" && col.id !== "fechas"; 
                return (
                  <th
                    key={col.id}
                    className={classNames(
                      headerBaseClasses,
                      clickable && headerClickableClasses,
                      col.className
                    )}
                    onClick={() => clickable && handleHeaderClick(col)}
                    aria-sort={
                      ordenCampo === col.id
                        ? ordenDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    scope="col"
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      {sortIndicator(col.id)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-texto/10">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-texto"
                >
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={classNames(
                        "px-6 py-4 text-texto text-sm font-semibold",
                        col.className
                      )}
                    >
                      {typeof col.renderCell === "function"
                        ? col.renderCell(row, rowIndex)
                        : row[col.id]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="lg:hidden space-y-4">
        {data.length === 0 ? (
          <div
            className={classNames(
              `backdrop-blur-md bg-secundario shadow-lg rounded-lg p-6 text-center text-texto ${
                currentTheme === "light"
                  ? "border-2 border-secundario/50"
                  : "border border-secundario/50"
              }`,
              className
            )}
          >
            No hay datos para mostrar.
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={row.id || rowIndex}
              className={classNames(
                `backdrop-blur-md bg-secundario shadow-lg rounded-lg p-4 space-y-3 ${
                  currentTheme === "light"
                    ? "border-2 border-secundario/50"
                    : "border border-secundario/50"
                }`,
                className
              )}
            >
              {columns.map((col) => {
                if (col.id === "acciones") return null;

                const cellContent =
                  typeof col.renderCell === "function"
                    ? col.renderCell(row, rowIndex)
                    : row[col.id];

                return (
                  <div key={col.id} className="flex flex-col space-y-1">
                    <div className="text-xs font-bold text-texto/75 uppercase tracking-wider">
                      {col.label}
                    </div>
                    <div className="text-sm font-semibold text-texto">
                      {cellContent || "—"}
                    </div>
                  </div>
                );
              })}

              {columns.find((col) => col.id === "acciones") && (
                <div className="flex flex-col space-y-1 pt-2 border-t border-texto/10">
                  <div className="text-xs font-bold text-texto/75 uppercase tracking-wider">
                    Acciones
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {columns
                      .find((col) => col.id === "acciones")
                      .renderCell(row, rowIndex)}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Table;
