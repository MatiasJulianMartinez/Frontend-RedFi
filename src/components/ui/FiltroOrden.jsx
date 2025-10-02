// Frontend/src/components/ui/FiltroOrden.jsx
import { IconArrowsSort, IconSearch } from "@tabler/icons-react";
import classNames from "classnames";
import { useTheme } from "../../context/ThemeContext";

const FiltroOrden = ({
  filtro,
  setFiltro,
  ordenCampo,
  setOrdenCampo,
  ordenDir,
  setOrdenDir,
  opcionesOrden = [],
  placeholder = "Buscar…",
}) => {
  const { currentTheme } = useTheme();

  const baseBox = classNames(
    "flex items-center gap-2 rounded-xl backdrop-blur-md shadow-md",
    currentTheme === "light"
      ? "bg-secundario border-2 border-texto/15"
      : "bg-secundario/50 border border-texto/25"
  );

  const baseInput = classNames(
    "w-full px-3 py-2 rounded-xl text-sm font-medium outline-none bg-transparent"
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      {/* Filtro */}
      <div className={classNames(baseBox, "flex-1 relative px-3")}>
        <IconSearch className="h-5 w-5 opacity-70 absolute left-3 top-2.5 pointer-events-none" />
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder={placeholder}
          className={classNames(baseInput, "pl-9")}
        />
      </div>

      {/* Orden */}
      <div className="flex items-center gap-3">
        <div className={classNames(baseBox, "px-3")}>
          <IconArrowsSort className="h-5 w-5 opacity-70" />
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className={classNames(baseInput, "w-auto bg-transparent")}
          >
            {opcionesOrden.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-fondo text-texto"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={classNames(baseBox, "px-3")}>
          <select
            value={ordenDir}
            onChange={(e) => setOrdenDir(e.target.value)}
            className={classNames(baseInput, "w-auto bg-transparent")}
          >
            <option value="asc" className="bg-fondo text-texto">
              Ascendente
            </option>
            <option value="desc" className="bg-fondo text-texto">
              Descendente
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltroOrden;
