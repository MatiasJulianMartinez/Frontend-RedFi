import classNames from "classnames";

// Configuración de tamaños disponibles para el badge
const SIZE_MAP = {
  xs: "text-xs px-2 py-1",
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
};

// Configuración de variantes de color y estilo
const VARIANT_MAP = {
  accent: "bg-acento/50 text-texto font-bold",
  muted: "bg-texto/15 text-texto font-bold",
  success: "bg-green-500/15 text-green-600",
  danger: "bg-red-500/15 text-red-600",
  info: "bg-blue-500/15 text-blue-600",
  admin: "bg-acento text-[#1a1a1a] font-bold",
  premium: "bg-acento text-[#1a1a1a] font-bold",
};

const Badge = ({
  children,
  className = "",
  size = "sm",
  rounded = "full",
  variant = "accent",
  bgClass,
  textClass,
  collapseOnMobile = false,
  onlyMobile = false,
  onlyDesktop = false,
  as = "span",
  icon: Icon = null,
  iconSize = 14,
  title = "", // Tooltip para mostrar texto completo
  truncate = false, // Habilitar truncamiento de texto
  maxWidth = "", // Ancho máximo personalizado (ej: "max-w-[150px]")
  ...props
}) => {
  // Determina el elemento HTML a renderizar (span por defecto)
  const Tag = as;

  // Configura las clases CSS según las props
  const roundedCls = rounded === "full" ? "rounded-full" : "rounded-lg";
  const sizeCls = SIZE_MAP[size] || SIZE_MAP.sm;
  const variantCls =
    bgClass || textClass
      ? classNames(bgClass, textClass) // Usa clases personalizadas si se proporcionan
      : VARIANT_MAP[variant] || VARIANT_MAP.accent; // Usa variante predefinida

  // Maneja la visibilidad responsiva del badge
  const displayCls = onlyMobile
    ? "inline-flex sm:hidden" // Solo visible en móvil
    : onlyDesktop || collapseOnMobile
    ? "hidden sm:inline-flex" // Solo visible en desktop
    : "inline-flex"; // Siempre visible

  // Clases para truncamiento de texto
  const truncateCls = truncate ? "truncate overflow-hidden text-ellipsis" : "";

  return (
    <Tag
      className={classNames(
        displayCls, // Controla la visibilidad responsiva
        "items-center gap-1", // Layout flexbox para icono y texto
        roundedCls,
        sizeCls,
        variantCls,
        truncate && maxWidth, // Aplica ancho máximo si truncate está activo
        className
      )}
      title={
        title || (truncate && typeof children === "string" ? children : "")
      } // Tooltip automático si hay truncamiento
      {...props}
    >
      {/* Renderiza icono opcional si se proporciona */}
      {Icon && <Icon size={iconSize} />}
      {/* Contenido del badge con posible truncamiento */}
      <span className={truncateCls}>{children}</span>
    </Tag>
  );
};

export default Badge;
