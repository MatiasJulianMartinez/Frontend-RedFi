import classNames from "classnames";

const RadioButton = ({
  id,
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
  size = "md",
  hideLabel = false,
  ...props
}) => {
  // Configuración de tamaños
  const sizeMap = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={classNames("flex items-center gap-2", className)}>
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={classNames(
            "cursor-pointer transition-all duration-200",
            "hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-acento/20",
            sizeMap[size],
            {
              "opacity-50 cursor-not-allowed": disabled,
            }
          )}
          {...props}
        />
      </div>

      {/* Solo mostrar label si no está oculto y existe */}
      {label && !hideLabel && (
        <label
          htmlFor={id}
          className={classNames(
            "cursor-pointer select-none text-sm text-texto",
            {
              "opacity-50 cursor-not-allowed": disabled,
              "hover:opacity-80": !disabled,
              "font-semibold": checked,
              "font-medium": !checked,
            }
          )}
        >
          {label}
        </label>
      )}

      {/* Label de screen reader siempre presente para accesibilidad */}
      <span className="sr-only">
        {checked
          ? "Opción correcta seleccionada"
          : "Seleccionar como opción correcta"}
      </span>
    </div>
  );
};

export default RadioButton;
