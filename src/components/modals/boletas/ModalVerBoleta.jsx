import { IconX, IconDownload, IconFileTypePdf, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalVerBoleta = ({ boleta, onClose, boletaAnterior }) => {
  // Verifica que existe la boleta antes de renderizar
  if (!boleta) return null;

  // Calcula diferencias de monto comparando con la boleta anterior del mismo proveedor
  const montoActual = parseFloat(boleta.monto);
  const montoAnterior = boletaAnterior
    ? parseFloat(boletaAnterior.monto)
    : null;

  // Estado inicial para mostrar diferencias de precio
  let diferenciaTexto = "—";
  let diferenciaColor = "text-texto";

  // Calcula y formatea la diferencia de precios si existe boleta anterior
  if (montoAnterior !== null) {
    const diferencia = montoActual - montoAnterior;
    const porcentaje = ((diferencia / montoAnterior) * 100).toFixed(1);
    
    if (diferencia > 0) {
      diferenciaTexto = (
        <span className="flex items-center gap-1 font-bold text-green-700/75">
          <IconTrendingUp size={16} />
          Subió ${diferencia.toFixed(2)} (+{porcentaje}%)
        </span>
      );
      diferenciaColor = "text-green-700";
    } else if (diferencia < 0) {
      diferenciaTexto = (
        <span className="flex items-center gap-1 font-bold text-red-600/75">
          <IconTrendingDown size={16} />
          Bajó ${Math.abs(diferencia).toFixed(2)} ({porcentaje}%)
        </span>
      );
      diferenciaColor = "text-red-600";
    } else {
      diferenciaTexto = `Sin cambios (0%)`;
      diferenciaColor = "text-yellow-600";
    }
  }

  // Verifica si el archivo adjunto es un PDF
  const esPDF = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');
  };

  // Extrae el nombre del archivo desde la URL
  const obtenerNombreArchivo = (url) => {
    if (!url) return 'archivo.pdf';
    const nombreCompleto = url.split('/').pop() || url.split('\\').pop();
    return nombreCompleto || `boleta-${boleta.mes}-${boleta.anio}.pdf`;
  };

  // Inicia la descarga del archivo de la boleta
  const descargarArchivo = () => {
    if (!boleta.url_imagen) return;
    
    const link = document.createElement('a');
    link.href = boleta.url_imagen;
    link.download = `boleta-${boleta.mes}-${boleta.anio}-${boleta.proveedor}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between mb-6">
        <MainH2 className="mb-0">Detalle de boleta</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Contenido principal con información y vista previa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Información detallada de la boleta */}
        <div className="space-y-3 ml-0 sm:ml-5 text-xl">
          <p>
            <strong>Mes:</strong> <span className="text-texto/75">{boleta.mes}</span>
          </p>
          <p>
            <strong>Año:</strong> <span className="text-texto/75">{boleta.anio}</span>
          </p>
          <p>
            <strong>Monto:</strong> <span className="text-texto/75">${montoActual.toFixed(2)}</span>
          </p>
          {/* Comparación con boleta anterior del mismo proveedor */}
          <p className={diferenciaColor}>
            <strong>Diferencia:</strong> {diferenciaTexto}
          </p>
          <p>
            <strong>Proveedor:</strong> <span className="text-texto/75">{boleta.proveedor}</span>
          </p>
          <p>
            <strong>Vencimiento:</strong>{" "}
            <span
              className="text-texto/75"
              title={new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            >
              {new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </p>

          {/* Fecha de fin de promoción (opcional) */}
          {boleta.promo_hasta && (
            <p className="text-yellow-600">
              <strong>Promoción hasta:</strong>{" "}
              <span
                className="text-yellow-600/75"
                title={new Date(boleta.promo_hasta).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              >
                {new Date(boleta.promo_hasta).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
        </div>

        {/* Vista previa y descarga del archivo adjunto */}
        <div className="flex flex-col items-center gap-4">
          {boleta.url_imagen ? (
            <>
              {/* Muestra vista previa según el tipo de archivo */}
              {esPDF(boleta.url_imagen) ? (
                // Vista previa para archivos PDF
                <div className="flex flex-col items-center gap-3 p-6 border border-dashed rounded-lg">
                  <IconFileTypePdf size={80} className="text-red-500" />
                  <p className="text-sm text-center font-medium break-all max-w-xs">
                    {obtenerNombreArchivo(boleta.url_imagen)}
                  </p>
                </div>
              ) : (
                // Vista previa para imágenes
                <img
                  src={boleta.url_imagen}
                  alt="Boleta"
                  className="max-h-[100px] md:max-h-[200px] object-contain rounded border"
                />
              )}
              {/* Botón de descarga del archivo */}
              <MainButton
                onClick={descargarArchivo}
                variant="accent"
                className="flex items-center gap-2"
              >
                <IconDownload size={18} />
                Descargar
              </MainButton>
            </>
          ) : (
            /* Mensaje cuando no hay archivo adjunto */
            <div className="text-center text-gray-400 italic border border-dashed p-6 rounded max-w-xs">
              ❌ El usuario no cargó un archivo de la boleta.
            </div>
          )}
        </div>
      </div>

      {/* Botón de cierre */}
      <div className="flex mt-6 justify-center">
        <MainButton
          variant="primary"
          onClick={onClose}
          className="flex-1"
        >
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerBoleta;