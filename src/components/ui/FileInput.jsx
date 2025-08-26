import { useRef, useState, useEffect } from "react";
import MainButton from "./MainButton";
import { IconX, IconFileTypePdf } from "@tabler/icons-react";

const FileInput = ({
  id = "archivo",
  label = "Seleccionar imagen",
  accept = "image/*, application/pdf",
  onChange,
  value = null,
  previewUrl = null,
  setPreviewUrl = null,
  onClear,
  disabled = false,
  loading = false,
  existingImage = null,
  sinPreview = false,
}) => {
  const inputRef = useRef(null);
  const [internalPreview, setInternalPreview] = useState(null);

  // Detectar si es PDF
  const esPDF = (url) => {
    if (!url) return false;
    // Detectar URLs de blob (archivos temporales) o URLs que contienen .pdf
    return url.toLowerCase().includes('.pdf') || 
           url.toLowerCase().includes('application/pdf') ||
           (url.startsWith('blob:') && value?.type === 'application/pdf');
  };

  // Obtener nombre del archivo
  const obtenerNombreArchivo = (url) => {
    if (!url) return 'archivo.pdf';
    
    // Si es un blob URL y tenemos el archivo original, usar su nombre
    if (url.startsWith('blob:') && value?.name) {
      return value.name;
    }
    
    const nombreCompleto = url.split('/').pop() || url.split('\\').pop();
    return nombreCompleto || 'archivo.pdf';
  };

  // Abrir archivo en nueva pestaña
  const abrirArchivo = () => {
    if (internalPreview) {
      window.open(internalPreview, '_blank');
    }
  };

  // Mostrar preview inicial si viene externa
  useEffect(() => {
    if (previewUrl) {
      setInternalPreview(previewUrl);
    } else if (existingImage) {
      setInternalPreview(existingImage);
    }
  }, [previewUrl, existingImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resetear el value para permitir volver a elegir el mismo archivo
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(file);

    if (!sinPreview) {
      // Para PDFs, crear URL temporal en lugar de base64
      if (file.type === 'application/pdf') {
        const objectUrl = URL.createObjectURL(file);
        setInternalPreview(objectUrl);
        setPreviewUrl?.(objectUrl);
      } else {
        // Para imágenes, usar base64 como antes
        const reader = new FileReader();
        reader.onloadend = () => {
          setInternalPreview(reader.result);
          setPreviewUrl?.(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    
    // Limpiar URL de objeto si existe
    if (internalPreview && internalPreview.startsWith('blob:')) {
      URL.revokeObjectURL(internalPreview);
    }
    
    onChange?.(null);
    setInternalPreview(null);
    if (!sinPreview) setPreviewUrl?.(null);
    onClear?.();
  };

  const hayPreview = internalPreview;
  const mostrarPreview = !sinPreview && hayPreview;
  const mostrarBotonQuitar = value || hayPreview;

  return (
    <div className="space-y-2 text-center text-texto">
      {label && (
        <label htmlFor={id} className="block font-medium">
          {label}
        </label>
      )}

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />

      {/* Preview */}
      {mostrarPreview && (
        <div className="mt-2 flex flex-col items-center gap-2">
          {esPDF(internalPreview) ? (
            <div 
              className="flex flex-col items-center gap-2 p-4 border border-texto/15 rounded-lg max-h-25 cursor-pointer hover:bg-texto/5 transition-colors"
              onClick={abrirArchivo}
              title="Click para abrir en nueva pestaña"
            >
              <IconFileTypePdf size={60} className="text-red-500" />
              <p className="text-xs text-center font-medium break-all max-w-xs">
                {obtenerNombreArchivo(internalPreview)}
              </p>
            </div>
          ) : (
            <img
              src={internalPreview}
              alt="Imagen seleccionada"
              className="max-h-25 border border-texto/15 rounded-lg object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={abrirArchivo}
              title="Click para abrir en nueva pestaña"
            />
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {mostrarBotonQuitar && (
            <div>
              <MainButton
                type="button"
                variant="danger"
                onClick={handleClear}
                className="flex-1"
                disabled={disabled || loading}
              >
                <IconX size={18} /> Quitar archivo
              </MainButton>
            </div>
          )}
          <label htmlFor={id}>
            <MainButton
              as="span"
              variant="accent"
              loading={loading}
              disabled={disabled}
              className="cursor-pointer flex-1"
            >
              {value || hayPreview ? "Cambiar archivo" : "Seleccionar archivo"}
            </MainButton>
          </label>
      </div>
      {/* Botón de quitar */}
    </div>
  );
};

export default FileInput;
