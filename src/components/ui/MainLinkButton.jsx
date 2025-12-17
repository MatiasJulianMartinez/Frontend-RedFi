import classNames from "classnames";
import { Link } from "react-router-dom";
import { IconLoader2 } from "@tabler/icons-react";
import { useRole } from "../../context/RoleContext";
import { useTheme } from "../../context/ThemeContext";

const LinkButton = ({
  to,
  children,
  icon: Icon = null,
  loading = false,
  variant = "primary",
  className = "",
  disabled = false,
  iconSize = 24,
  isPremium = false,
  iconPosition = "left",
  tituloPremium = "",
  iconAlwaysVisible = false,
  ...props
}) => {
  const { plan } = useRole();

  // Detecta si es variante de tarjeta para aplicar estilos especiales
  const esCard =
    variant === "card" || variant === "cardAdmin" || variant === "curso";
  const hasCustomPadding = /\bp[trblxy]?-\d+\b/.test(className);
  const { currentTheme } = useTheme();

  // Lógica de bloqueo para funciones premium
  const bloquearAcceso = isPremium && plan === "basico";

  // Estilos base que se adaptan según si es tarjeta o botón normal
  const baseStyles = classNames(
    esCard
      ? "block text-center rounded-lg transition relative overflow-hidden"
      : "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus:outline-none",
    !hasCustomPadding && (esCard ? "p-4" : "px-4 py-2")
  );

  // Genera estilos específicos para variantes de tarjeta según el tema
  const getCardVariant = () => {
    if (variant !== "card") return null;

    if (currentTheme === "light") {
      return isPremium
        ? "bg-secundario border-1 border-texto/15 hover:bg-[#2a3955]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center" // Light theme - Premium
        : "bg-secundario border-1 border-texto/15 hover:bg-[#2a3955]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center"; // Light theme - No premium
    } else {
      return isPremium
        ? "bg-primario/20 backdrop-blur-md border border-white/10 hover:bg-[#336ef0]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center" // Dark theme - Premium
        : "bg-primario/20 backdrop-blur-md border border-white/10 hover:bg-[#336ef0]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center"; // Dark theme - No premium
    }
  };

  // Configuración completa de estilos para cada variante del botón-enlace
  const variants = {
    primary:
      "bg-primario text-white hover:bg-[#336ef0] border-1 border-texto/15",
    accent:
      "bg-acento text-[#1a1a1a] hover:bg-[#fca75f] border-1 border-texto/15",
    secondary:
      currentTheme === "light"
        ? "bg-texto/15 text-texto hover:bg-texto/30 border-1 border-texto/15" // Light
        : "bg-texto/15 text-texto hover:bg-texto/30 border-1 border-texto/15", // Dark
    danger: "bg-red-600 text-texto hover:bg-red-700",
    navbar: "bg-transparent text-texto hover:bg-white/10",
    navbarIcon: "bg-transparent text-acento hover:scale-105 hover:text-texto",
    disabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
    link: "text-texto hover:text-acento font-medium !p-0 !h-auto",
    inline: "text-acento font-bold hover:underline !p-0 !h-auto !m-0 inline",
    card: getCardVariant(), // Estilos dinámicos para tarjetas
    cardAdmin:
      currentTheme === "light"
        ? "bg-acento/20 backdrop-blur-md border-1 border-acento hover:bg-[#fca75f]/60 text-texto min-h-[130px] flex flex-col justify-center shadow-lg" // Light theme
        : "bg-acento/20 backdrop-blur-md border border-white/10 hover:bg-[#fca75f]/30 text-texto min-h-[130px] flex flex-col justify-center shadow-lg", // Dark theme
    curso:
      currentTheme === "light"
        ? "flex flex-col md:flex-row bg-secundario border-1 border-texto/15 rounded-lg overflow-hidden transition shadow-lg text-texto w-full h-full hover:bg-[#2a3955]/10 hover:scale-[1.02]" // Light theme - vertical on mobile, horizontal on desktop
        : "flex flex-col md:flex-row bg-secundario border border-secundario/50 rounded-lg overflow-hidden transition shadow-lg text-texto w-full h-full hover:bg-secundario/80 hover:scale-[1.02]", // Dark theme - vertical on mobile, horizontal on desktop
  };

  // Estilos específicos para estado de carga
  const loadingStyles = "bg-gray-400 text-gray-700 cursor-not-allowed";

  // Combina todos los estilos según el estado del botón-enlace
  const finalClass = classNames(
    baseStyles,
    loading ? loadingStyles : variants[variant],
    {
      "opacity-50 pointer-events-none": disabled || loading || bloquearAcceso,
    },
    className
  );

  // Para variante inline, renderizar directamente sin div wrapper
  if (variant === "inline") {
    return (
      <Link to={to} className={finalClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <div className="relative">
      <Link to={to} className={finalClass} {...props}>
        {/* Renderizado condicional según posición del icono */}
        {iconPosition === "left" && (
          <>
            {/* Icono izquierdo con spinner de carga o icono normal */}
            {loading ? (
              <IconLoader2 size={iconSize} className="animate-spin" />
            ) : (
              Icon && (
                <Icon size={iconSize} className={iconAlwaysVisible ? "" : "hidden sm:inline-block"} />
              )
            )}
            {/* Contenido del enlace */}
            {children}
          </>
        )}

        {iconPosition === "right" && (
          <>
            {/* Contenido del enlace */}
            {children}
            {/* Icono derecho con spinner de carga o icono normal */}
            {loading ? (
              <IconLoader2 size={iconSize} className="animate-spin" />
            ) : (
              Icon && (
                <Icon size={iconSize} className={iconAlwaysVisible ? "" : "hidden sm:inline-block"} />
              )
            )}
          </>
        )}
      </Link>

      {/* Overlay de bloqueo para funciones premium en tarjetas */}
      {bloquearAcceso && esCard && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20 text-texto border border-texto/15 flex items-center justify-center px-4 text-center font-bold rounded-lg pointer-events-auto z-10">
          <span>
            {tituloPremium || "Esta función"} es solo para usuarios{" "}
            <span className="text-acento">Premium</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default LinkButton;

