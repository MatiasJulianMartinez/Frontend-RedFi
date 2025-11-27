const ModalContenedor = ({
  children,
  onClose = null,
  maxWidth = "max-w-xl",
  maxHeight = "max-h-[90vh]", // Parámetro para controlar altura máxima
  variant = "default", // Nueva prop para diferentes variantes
}) => {
  // Configuraciones específicas por variante
  const getVariantClasses = () => {
    switch (variant) {
      case "curso":
        return {
          maxWidth: "max-w-4xl", // Más ancho para cursos
          maxHeight: "max-h-[90vh]",
          overflow: "overflow-hidden", // Sin overflow para controlar internamente
        };
      case "dropdown":
        return {
          maxWidth,
          maxHeight,
          overflow: "overflow-visible", // Permite que dropdowns se muestren fuera del modal
        };
      default:
        return {
          maxWidth,
          maxHeight,
          overflow: "overflow-y-auto", // Cambiado a auto para permitir scroll si es necesario
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    /* Backdrop de pantalla completa con z-index alto */
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center px-4 sm:px-6 pb-20 lg:pb-0">
      {/* Contenedor principal del modal con dimensiones configurables */}
      <div
        className={`bg-secundario border border-secundario/50 rounded-lg w-full ${variantClasses.maxWidth} ${variantClasses.maxHeight} ${variantClasses.overflow} flex flex-col text-texto relative`}
        onClick={(e) => e.stopPropagation()} // Previene cierre al hacer click en el modal
      >
        {/* Área de contenido con padding y flex-1 para ocupar espacio disponible */}
        <div
          className={
            variant === "curso" ? "flex-1 flex flex-col p-6" : "flex-1 p-6"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalContenedor;
