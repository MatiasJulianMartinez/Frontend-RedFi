import { IconX, IconEye, IconTrash, IconEdit, IconDownload, IconFileTypePdf } from "@tabler/icons-react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalVerBoleta = ({ boleta, onClose, boletaAnterior }) => {
  if (!boleta) return null;

  const montoActual = parseFloat(boleta.monto);
  const montoAnterior = boletaAnterior
    ? parseFloat(boletaAnterior.monto)
    : null;

  let diferenciaTexto = "—";
  let diferenciaColor = "text-texto";

  if (montoAnterior !== null) {
    const diferencia = montoActual - montoAnterior;
    if (diferencia > 0) {
      diferenciaTexto = `📈 Subió $${diferencia.toFixed(2)}`;
      diferenciaColor = "text-green-700";
    } else if (diferencia < 0) {
      diferenciaTexto = `📉 Bajó $${Math.abs(diferencia).toFixed(2)}`;
      diferenciaColor = "text-red-600";
    } else {
      diferenciaTexto = `🟰 Sin cambios`;
      diferenciaColor = "text-yellow-600";
    }
  }

  const esPDF = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');
  };

  const obtenerNombreArchivo = (url) => {
    if (!url) return 'archivo.pdf';
    const nombreCompleto = url.split('/').pop() || url.split('\\').pop();
    return nombreCompleto || `boleta-${boleta.mes}-${boleta.anio}.pdf`;
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3 ml-0 sm:ml-5 text-xl">
          <p>
            <strong>Mes:</strong> {boleta.mes}
          </p>
          <p>
            <strong>Año:</strong> {boleta.anio}
          </p>
          <p>
            <strong>Monto:</strong> ${montoActual.toFixed(2)}
          </p>
          <p className={diferenciaColor}>
            <strong>Diferencia:</strong> {diferenciaTexto}
          </p>
          <p>
            <strong>Proveedor:</strong> {boleta.proveedor}
          </p>
          <p>
            <strong>Vencimiento:</strong>{" "}
            {new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          {boleta.promo_hasta && (
            <p className="text-yellow-600">
              <strong>Promoción hasta:</strong>{" "}
              {new Date(boleta.promo_hasta).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          {boleta.url_imagen ? (
            <>
              {esPDF(boleta.url_imagen) ? (
                <div className="flex flex-col items-center gap-3 p-6 border border-dashed rounded-lg">
                  <IconFileTypePdf size={80} className="text-red-500" />
                  <p className="text-sm text-center font-medium break-all max-w-xs">
                    {obtenerNombreArchivo(boleta.url_imagen)}
                  </p>
                </div>
              ) : (
                <img
                  src={boleta.url_imagen}
                  alt="Boleta"
                  className="max-h-[300px] object-contain rounded border"
                />
              )}
              <MainButton
                onClick={descargarArchivo}
                variant="accent"
                className="flex items-center gap-2"
              >
                <IconDownload size={18} />
                Descargar archivo
              </MainButton>
            </>
          ) : (
            <div className="text-center text-gray-400 italic border border-dashed p-6 rounded max-w-xs">
              ❌ El usuario no cargó un archivo de la boleta.
            </div>
          )}
        </div>
      </div>

      {/* Botón */}
      <div className="mt-6 flex justify-end">
        <MainButton variant="primary" onClick={onClose}>
          Cerrar
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalVerBoleta;