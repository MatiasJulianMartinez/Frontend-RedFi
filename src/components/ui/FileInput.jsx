import { useRef, useState, useEffect } from "react";
import MainButton from "./MainButton";
import { IconX, IconFileTypePdf } from "@tabler/icons-react";
import { useAlerta } from "../../context/AlertaContext";

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
  hideRemoveButton = false,
  esBoletas = false, // Nueva prop para identificar uso en Boletas
}) => {
  const inputRef = useRef(null);
  const [internalPreview, setInternalPreview] = useState(null);
  const { mostrarError } = useAlerta();

  // Determina qué tipos de archivo acepta el input
  const getAcceptedTypes = () => {
    const acceptLower = accept.toLowerCase();
    const acceptsImages = acceptLower.includes("image");
    const acceptsPDF =
      acceptLower.includes("pdf") || acceptLower.includes("application/pdf");

    return { acceptsImages, acceptsPDF };
  };

  // Genera mensaje informativo sobre límites de archivos
  const getLimitMessage = () => {
    const { acceptsImages, acceptsPDF } = getAcceptedTypes();

    // Límites específicos para Boletas
    if (esBoletas) {
      if (acceptsImages && acceptsPDF) {
        return "Imágenes: máx. 800KB y 2000x2000px • PDFs: máx. 10MB";
      } else if (acceptsImages) {
        return "Máx. 800KB y resolución 2000x2000px";
      } else if (acceptsPDF) {
        return "Máx. 10MB";
      }
    }

    // Límites estándar para otros usos
    if (acceptsImages && acceptsPDF) {
      return "Imágenes: máx. 300KB y 500x500px • PDFs: máx. 10MB";
    } else if (acceptsImages) {
      return "Máx. 300KB y resolución 500x500px";
    } else if (acceptsPDF) {
      return "Máx. 10MB";
    }

    return null;
  };

  // Validación de archivos según tipo y restricciones
  const validarArchivo = (file) => {
    return new Promise((resolve, reject) => {
      // Validar tamaño de PDF
      if (file.type === "application/pdf") {
        const maxSizePDF = esBoletas
          ? 50 * 1024 * 1024 // 10MB para Boletas
          : 10 * 1024 * 1024; // 10MB estándar

        const limitText = esBoletas ? "10MB" : "10MB";

        if (file.size > maxSizePDF) {
          reject(`El archivo PDF no puede superar los ${limitText}`);
          return;
        }
        resolve(true);
        return;
      }

      // Validar imágenes
      if (file.type.startsWith("image/")) {
        const maxSizeImage = esBoletas
          ? 800 * 1024 // 800KB para Boletas
          : 300 * 1024; // 300KB estándar

        const maxDimension = esBoletas ? 2000 : 500; // 2000x2000px para Boletas, 500x500px estándar

        const sizeText = esBoletas ? "800KB" : "300KB";
        const dimensionText = esBoletas ? "2000x2000" : "500x500";

        // Validar tamaño del archivo
        if (file.size > maxSizeImage) {
          reject(`La imagen no puede superar los ${sizeText}`);
          return;
        }

        // Validar dimensiones de la imagen
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl); // Limpiar memoria

          if (img.width > maxDimension || img.height > maxDimension) {
            reject(`La imagen no puede superar los ${dimensionText} píxeles`);
          } else {
            resolve(true);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject("Error al cargar la imagen para validación");
        };

        img.src = objectUrl;
        return;
      }

      // Otros tipos de archivo se aceptan sin validación específica
      resolve(true);
    });
  };

  // Detecta si el archivo actual es un PDF
  const esPDF = (url) => {
    if (!url) return false;
    // Detecta URLs de blob (archivos temporales) o URLs que contienen .pdf
    return (
      url.toLowerCase().includes(".pdf") ||
      url.toLowerCase().includes("application/pdf") ||
      (url.startsWith("blob:") && value?.type === "application/pdf")
    );
  };

  // Extrae el nombre del archivo desde la URL o el objeto File
  const obtenerNombreArchivo = (url) => {
    if (!url) return "archivo.pdf";

    // Si es un blob URL y tenemos el archivo original, usar su nombre
    if (url.startsWith("blob:") && value?.name) {
      return value.name;
    }

    const nombreCompleto = url.split("/").pop() || url.split("\\").pop();
    return nombreCompleto || "archivo.pdf";
  };

  // Abre el archivo en una nueva pestaña del navegador
  const abrirArchivo = () => {
    if (internalPreview) {
      window.open(internalPreview, "_blank");
    }
  };

  // Inicializa el preview con URLs externas o imágenes existentes
  useEffect(() => {
    if (previewUrl) {
      setInternalPreview(previewUrl);
    } else if (existingImage) {
      setInternalPreview(existingImage);
    }
  }, [previewUrl, existingImage]);

  // Maneja la selección de archivos y genera preview según el tipo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resetea el value para permitir volver a elegir el mismo archivo
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    try {
      // Validar el archivo antes de procesarlo
      await validarArchivo(file);

      // Si la validación es exitosa, procesar el archivo
      onChange?.(file);

      if (!sinPreview) {
        // Para PDFs, crear URL temporal en lugar de base64
        if (file.type === "application/pdf") {
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
    } catch (error) {
      // Mostrar mensaje de error y no procesar el archivo
      mostrarError(error);

      // Resetear el input para que el usuario pueda seleccionar otro archivo
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Limpia el archivo seleccionado y su preview
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Libera memoria de URL de objeto si existe
    if (internalPreview && internalPreview.startsWith("blob:")) {
      URL.revokeObjectURL(internalPreview);
    }

    onChange?.(null);
    setInternalPreview(null);
    if (!sinPreview) setPreviewUrl?.(null);
    onClear?.();
  };

  // Variables de control para el renderizado condicional
  const hayPreview = internalPreview;
  const mostrarPreview = !sinPreview && hayPreview;
  const mostrarBotonQuitar = !hideRemoveButton && (value || hayPreview);

  return (
    <div className="space-y-3 text-texto">
      {/* Label opcional del input */}
      {label && (
        <div>
          <label htmlFor={id} className="block text-texto mb-1">
            {label}
          </label>
          {getLimitMessage() && (
            <p className="text-xs text-texto/75 mb-2">{getLimitMessage()}</p>
          )}
        </div>
      )}

      {/* Input de archivo oculto */}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />

      {/* Área de preview compacta */}
      {mostrarPreview && (
        <div className="bg-texto/5 border border-texto/15 rounded-lg p-3">
          {esPDF(internalPreview) ? (
            // Preview compacto para archivos PDF
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <IconFileTypePdf
                  size={24}
                  className="text-red-500 flex-shrink-0"
                />
                <span
                  className="text-sm font-medium truncate"
                  title={obtenerNombreArchivo(internalPreview)}
                >
                  {obtenerNombreArchivo(internalPreview)}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <MainButton
                  type="button"
                  onClick={abrirArchivo}
                  variant="see"
                  disabled={disabled || loading}
                  className="text-xs px-2 py-1 h-auto"
                  title="Abrir archivo"
                />
                <label htmlFor={id}>
                  <MainButton
                    as="span"
                    variant="edit"
                    disabled={disabled || loading}
                    className="cursor-pointer text-xs px-2 py-1 h-auto"
                    title="Cambiar archivo"
                  />
                </label>
                {mostrarBotonQuitar && (
                  <MainButton
                    type="button"
                    variant="delete"
                    onClick={handleClear}
                    disabled={disabled || loading}
                    className="text-xs px-2 py-1 h-auto"
                    title="Quitar archivo"
                  />
                )}
              </div>
            </div>
          ) : (
            // Preview compacto para imágenes
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={internalPreview}
                  alt="Preview"
                  className="w-8 h-8 object-cover rounded border border-texto/15 flex-shrink-0"
                />
                <span className="text-sm font-medium truncate">
                  Imagen seleccionada
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <MainButton
                  type="button"
                  onClick={abrirArchivo}
                  variant="see"
                  disabled={disabled || loading}
                  className="text-xs px-2 py-1 h-auto"
                  title="Ver imagen"
                  iconAlwaysVisible
                />
                <label htmlFor={id}>
                  <MainButton
                    as="span"
                    variant="edit"
                    disabled={disabled || loading}
                    className="cursor-pointer text-xs px-2 py-1 h-auto"
                    title="Cambiar imagen"
                    iconAlwaysVisible
                  />
                </label>
                {mostrarBotonQuitar && (
                  <MainButton
                    type="button"
                    variant="delete"
                    onClick={handleClear}
                    disabled={disabled || loading}
                    className="text-xs px-2 py-1 h-auto"
                    title="Quitar imagen"
                    iconAlwaysVisible
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controles en línea - solo cuando no hay preview */}
      {!mostrarPreview && (
        <div className="flex gap-2">
          <label htmlFor={id} className="flex-1">
            <MainButton
              as="span"
              variant="accent"
              loading={loading}
              disabled={disabled}
              className="cursor-pointer w-full"
            >
              Seleccionar archivo
            </MainButton>
          </label>
        </div>
      )}
    </div>
  );
};

export default FileInput;
