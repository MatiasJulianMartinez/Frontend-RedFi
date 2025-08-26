import { Link } from "react-router-dom";
import { IconLoader2 } from "@tabler/icons-react";
import classNames from "classnames";
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
  ...props
}) => {
  const { plan } = useRole();
  const esCard = variant === "card" || variant === "cardAdmin";
  const hasCustomPadding = /\bp[trblxy]?-\d+\b/.test(className);
  const { currentTheme } = useTheme();
  const bloquearAcceso = isPremium && plan === "basico";

  const baseStyles = classNames(
    esCard
      ? "block text-center rounded-lg transition relative overflow-hidden"
      : "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus:outline-none",
    !hasCustomPadding && (esCard ? "p-4" : "px-6 py-3")
  );

  const getCardVariant = () => {
  if (variant !== "card") return null;
  
  if (currentTheme === "light") {
    return isPremium
      ? "bg-secundario border border-secundario hover:bg-[#2a3955]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center"
      : "bg-secundario border border-secundario hover:bg-[#2a3955]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center";
  } else {
    return isPremium
      ? "bg-primario/20 backdrop-blur-md border border-white/10 hover:bg-[#336ef0]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center"
      : "bg-primario/20 backdrop-blur-md border border-white/10 hover:bg-[#336ef0]/30 shadow-lg text-texto min-h-[130px] flex flex-col justify-center";
  }
};

  const variants = {
    primary: "bg-primario text-white hover:bg-[#336ef0]",
    accent: "bg-acento text-white hover:bg-[#fca75f]",
    secondary: currentTheme === "light" 
  ? "bg-secundario text-texto hover:bg-[#d2e4ff]"  // Light
  : "bg-secundario text-texto hover:bg-[#2a3955]", // Dark
    danger: "bg-red-600 text-texto hover:bg-red-700",
    navbar: "bg-transparent text-texto hover:bg-white/10",
    navbarIcon: "bg-transparent text-acento hover:scale-105 hover:text-texto",
    disabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
    card: getCardVariant(),
    cardAdmin: currentTheme === "light"
    ? "bg-acento/20 backdrop-blur-md border border-acento hover:bg-[#fca75f]/60 text-texto min-h-[130px] flex flex-col justify-center shadow-lg"
    : "bg-acento/20 backdrop-blur-md border border-white/10 hover:bg-[#fca75f]/30 text-texto min-h-[130px] flex flex-col justify-center shadow-lg",
    curso: "flex flex-col bg-secundario border border-secundario/50 rounded-lg overflow-hidden transition shadow-lg text-texto w-full h-full",
  };

  const loadingStyles = "bg-gray-400 text-gray-700 cursor-not-allowed";

  const finalClass = classNames(
    baseStyles,
    loading ? loadingStyles : variants[variant],
    {
      "opacity-50 pointer-events-none": disabled || loading || bloquearAcceso,
    },
    className
  );

  return (
    <div className="relative">
      <Link to={to} className={finalClass} {...props}>
        {/* Orden dinámico según iconPosition */}
        {iconPosition === "left" && (
          <>
            {loading ? (
              <IconLoader2 size={iconSize} className="animate-spin" />
            ) : (
              Icon && <Icon size={iconSize} className="hidden sm:inline-block" />
            )}
            {children}
          </>
        )}

        {iconPosition === "right" && (
          <>
            {children}
            {loading ? (
              <IconLoader2 size={iconSize} className="animate-spin" />
            ) : (
              Icon && <Icon size={iconSize} className="hidden sm:inline-block"/>
            )}
          </>
        )}
      </Link>

      {/* Overlay para premium bloqueado */}
      {bloquearAcceso && esCard && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20 text-texto border border-texto/15 flex items-center justify-center px-4 text-center font-bold rounded-lg pointer-events-auto z-10">
          Esta función es exclusiva para el plan{" "}
          <span className="text-acento ml-1">Premium</span>
        </div>
      )}
    </div>
  );
};

export default LinkButton;