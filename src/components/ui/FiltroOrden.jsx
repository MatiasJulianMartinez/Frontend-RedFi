// Frontend/src/components/ui/FiltroOrden.jsx
import { useState } from "react";
import {
  IconArrowsSort,
  IconSearch,
  IconChevronDown,
} from "@tabler/icons-react";
import classNames from "classnames";

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
  const [isCampoOpen, setIsCampoOpen] = useState(false);
  const [isDirOpen, setIsDirOpen] = useState(false);
  // Estilo base para inputs (igual que Input.jsx)
  const baseInputStyles = classNames(
    "w-full bg-texto/5 text-texto rounded-lg border transition",
    "focus:outline-none focus:ring-1",
    "py-2",
    "border-texto/15 focus:border-acento focus:ring-acento"
  );

  // Estilo base para selects (igual que Select.jsx)
  const baseSelectStyles = classNames(
    "w-full px-3 py-2 bg-texto/5 text-texto rounded-lg border transition",
    "appearance-none max-w-full truncate",
    "focus:outline-none focus:ring-1",
    "border-texto/15 focus:border-acento focus:ring-1 focus:ring-acento"
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 mb-4">
      {/* Campo de búsqueda - Ocupa el espacio restante */}
      <div className="flex-1 relative">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch size={20} className="text-texto/75" />
        </div>

        {/* Input de búsqueda con el mismo estilo que Input.jsx */}
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder={placeholder}
          className={classNames(baseInputStyles, "pl-10 pr-3")}
        />
      </div>

      {/* Select de campo de ordenamiento - 20% del ancho en desktop */}
      <div className="flex-1 sm:flex-none sm:w-[20%] relative">
        {/* Icono de ordenamiento */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconArrowsSort size={20} className="text-texto/75" />
        </div>

        {/* Select de campo */}
        <select
          value={ordenCampo}
          onChange={(e) => setOrdenCampo(e.target.value)}
          onFocus={() => setIsCampoOpen(true)}
          onBlur={() => setIsCampoOpen(false)}
          className={classNames(baseSelectStyles, "pl-10 pr-10 min-w-0")}
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

        {/* Icono chevron derecho */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <IconChevronDown
            size={20}
            className={`text-texto/75 transition-transform ${
              isCampoOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Select de dirección de ordenamiento - 20% del ancho en desktop */}
      <div className="flex-1 sm:flex-none sm:w-[20%] relative">
        <select
          value={ordenDir}
          onChange={(e) => setOrdenDir(e.target.value)}
          onFocus={() => setIsDirOpen(true)}
          onBlur={() => setIsDirOpen(false)}
          className={classNames(baseSelectStyles, "pl-3 pr-10 min-w-0")}
        >
          <option value="asc" className="bg-fondo text-texto">
            Ascendente
          </option>
          <option value="desc" className="bg-fondo text-texto">
            Descendente
          </option>
        </select>

        {/* Icono chevron derecho */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <IconChevronDown
            size={20}
            className={`text-texto/75 transition-transform ${
              isDirOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltroOrden;
