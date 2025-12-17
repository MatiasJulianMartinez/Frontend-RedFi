import {
  IconX,
  IconDownload,
  IconFileTypePdf,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";
import { useTheme } from "../../../context/ThemeContext";

const ModalVerBoleta = ({ boleta, onClose, boletaAnterior }) => {
  const { currentTheme } = useTheme();
  
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
        <div className="font-bold">
          {/* Versión completa para pantallas grandes */}
          <span className="hidden sm:flex items-center gap-2">
            <IconTrendingUp size={16} />
            Subió ${diferencia.toFixed(2)} (+{porcentaje}%)
          </span>
          {/* Versión simplificada para pantallas pequeñas */}
          <span className="sm:hidden">
            Subió ${diferencia.toFixed(2)}
          </span>
        </div>
      );
      diferenciaColor = currentTheme === 'light' ? 'text-green-800' : 'text-green-400';
    } else if (diferencia < 0) {
      diferenciaTexto = (
        <div className="font-bold">
          {/* Versión completa para pantallas grandes */}
          <span className="hidden sm:flex items-center gap-2">
            <IconTrendingDown size={16} />
            Bajó ${Math.abs(diferencia).toFixed(2)} ({porcentaje}%)
          </span>
          {/* Versión simplificada para pantallas pequeñas */}
          <span className="sm:hidden">
            Bajó ${Math.abs(diferencia).toFixed(2)}
          </span>
        </div>
      );
      diferenciaColor = currentTheme === 'light' ? 'text-red-800' : 'text-red-400';
    } else {
      diferenciaTexto = (
        <div className="font-bold">
          <span className="hidden sm:inline">Sin cambios (0%)</span>
          <span className="sm:hidden">Sin cambios</span>
        </div>
      );
      diferenciaColor = currentTheme === 'light' ? 'text-yellow-800' : 'text-yellow-400';
    }
  }

  // Verifica si el archivo adjunto es un PDF
  const esPDF = (url) => {
    if (!url) return false;
    return (
      url.toLowerCase().includes(".pdf") ||
      url.toLowerCase().includes("application/pdf")
    );
  };

  // Extrae el nombre del archivo desde la URL
  const obtenerNombreArchivo = (url) => {
    if (!url) return "archivo.pdf";
    const nombreCompleto = url.split("/").pop() || url.split("\\").pop();
    return nombreCompleto || `boleta-${boleta.mes}-${boleta.anio}.pdf`;
  };

  // Inicia la descarga del archivo de la boleta
  const descargarArchivo = () => {
    if (!boleta.url_imagen) return;

    const link = document.createElement("a");
    link.href = boleta.url_imagen;
    link.download = `boleta-${boleta.mes}-${boleta.anio}-${boleta.proveedor}`;
    link.target = "_blank";
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

      {/* Contenido principal organizado como tabla */}
      <div className="space-y-6">
        {/* Tabla de información principal */}
        <div className="bg-secundario rounded-lg border border-texto/15 overflow-hidden">
          <div className="bg-texto/5 text-texto px-4 py-3">
            <h3 className="font-semibold text-lg">Información de la Boleta</h3>
          </div>
          
          <div className="divide-y divide-texto/15">
            {/* Período */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="font-medium text-texto/80">Período</span>
              <span className="font-semibold text-acento">{boleta.mes} {boleta.anio}</span>
            </div>
            
            {/* Proveedor */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="font-medium text-texto/80">Proveedor</span>
              <span className="font-semibold">{boleta.proveedor}</span>
            </div>
            
            {/* Monto */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="font-medium text-texto/80">Monto</span>
              <span className="font-semibold text-acento">${montoActual.toFixed(2)}</span>
            </div>
            
            {/* Diferencia */}
            <div className="px-4 py-3">
              <div className="flex flex-row justify-between sm:items-center gap-1 sm:gap-0">
                <span className="font-medium text-texto/80">Diferencia</span>
                <div className={diferenciaColor}>{diferenciaTexto}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de fechas importantes */}
        <div className="bg-secundario rounded-lg border border-texto/15 overflow-hidden">
          <div className="bg-texto/5 text-texto  px-4 py-3">
            <h3 className="font-semibold text-lg">Fechas Importantes</h3>
          </div>
          
          <div className="divide-y divide-texto/15">
            {/* Vencimiento */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="font-medium text-texto/80">Vencimiento</span>
              <span 
                className={`font-semibold ${currentTheme === 'light' ? 'text-red-800' : 'text-red-400'}`}
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
            </div>
            
            {/* Promoción hasta (opcional) */}
            {boleta.promo_hasta && (
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-texto/80">Promoción hasta</span>
                <span 
                  className={`font-semibold ${currentTheme === 'light' ? 'text-yellow-700' : 'text-yellow-400'}`}
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
              </div>
            )}
          </div>
        </div>

        {/* Sección de archivo adjunto */}
        <div className="bg-secundario rounded-lg border border-texto/15 overflow-hidden">
          <div className="bg-texto/5 text-texto px-4 py-3">
            <h3 className="font-semibold text-lg">Archivo Adjunto</h3>
          </div>
          
          <div className="p-4">
            {boleta.url_imagen ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Vista previa del archivo */}
                <div className="flex-shrink-0">
                  {esPDF(boleta.url_imagen) ? (
                    // Vista previa para archivos PDF
                    <div className="flex flex-col items-center gap-2 p-4 border border-dashed border-texto/30 rounded-lg bg-texto/5">
                      <IconFileTypePdf size={48} className="text-red-500" />
                      <p className="text-xs text-center font-medium text-texto/70 max-w-[120px] truncate">
                        {obtenerNombreArchivo(boleta.url_imagen)}
                      </p>
                    </div>
                  ) : (
                    // Vista previa para imágenes
                    <img
                      src={boleta.url_imagen}
                      alt="Boleta"
                      className="max-h-[80px] sm:max-h-[120px] object-contain rounded border"
                    />
                  )}
                </div>
                
                {/* Información y botón de descarga */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-texto/70 mb-3">
                    {esPDF(boleta.url_imagen) ? 'Archivo PDF disponible para descarga' : 'Imagen de la boleta disponible'}
                  </p>
                  <MainButton
                    onClick={descargarArchivo}
                    variant="accent"
                    className="flex items-center gap-2 mx-auto sm:mx-0"
                  >
                    <IconDownload size={18} />
                    Descargar
                  </MainButton>
                </div>
              </div>
            ) : (
              /* Mensaje cuando no hay archivo adjunto */
              <div className="text-center py-6">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-texto/50 italic">
                  No se cargó archivo para esta boleta
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón de cierre */}
      <div className="flex mt-6 justify-center">
        <MainButton variant="primary" onClick={onClose} className="flex-1">
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerBoleta;
