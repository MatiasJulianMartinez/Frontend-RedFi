// src/components/ui/ModalContenedor.jsx

const ModalContenedor = ({ 
  children, 
  onClose = null, 
  maxWidth = "max-w-xl",
  maxHeight = "max-h-[85vh]" // Nuevo parámetro para altura máxima
}) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center px-4 sm:px-6 pb-20 lg:pb-0">
      <div
        className={`bg-secundario border border-secundario/50 rounded-lg w-full ${maxWidth} ${maxHeight} overflow-hidden flex flex-col text-texto relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalContenedor;
