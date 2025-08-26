import React, { useEffect, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import classNames from "classnames";

const MainLoader = ({ 
  texto = "", 
  className = "", 
  size = "medium", 
  variant = "inline",
  visible = true 
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  // Configuración de tamaños
  const sizeConfig = {
    small: { icon: 20, text: "text-sm" },
    medium: { icon: 24, text: "text-base" },
    large: { icon: 42, text: "text-lg sm:text-xl font-bold" }
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;

  if (variant === "overlay") {
    if (!isVisible) return null;

    return (
      <div
        className={classNames(
          "fixed inset-0 z-45 flex items-center justify-center transition-opacity duration-300",
          visible ? "opacity-75 pointer-events-auto" : "opacity-0 pointer-events-none",
          className
        )}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="flex flex-col items-center gap-3 text-texto">
          <IconLoader2 size={currentSize.icon} className="animate-spin text-texto" />
          {texto && (
            <p className={classNames(currentSize.text, "tracking-wide")}>
              {texto}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variante inline (por defecto)
  return (
    <div className={classNames("flex flex-col items-center justify-center gap-3 text-texto", className)}>
      <IconLoader2 size={currentSize.icon} className="animate-spin" />
      {texto && (
        <span className={classNames(currentSize.text, "font-medium")}>
          {texto}
        </span>
      )}
    </div>
  );
};

export default MainLoader;
