import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import Alerta from '../components/ui/Alerta';

const AlertaContext = createContext();

export const useAlerta = () => {
  const context = useContext(AlertaContext);
  if (!context) {
    throw new Error('useAlerta debe usarse dentro de AlertaProvider');
  }
  return context;
};

export const AlertaProvider = ({ children }) => {
  const [alertas, setAlertas] = useState([]);

  const mostrarAlerta = (mensaje, tipo = 'error', opciones = {}) => {
    const id = Date.now() + Math.random();
    const nuevaAlerta = {
      id,
      mensaje,
      tipo,
      ...opciones
    };
    
    setAlertas(prev => [...prev, nuevaAlerta]);
    return id;
  };

  const cerrarAlerta = (id) => {
    setAlertas(prev => prev.filter(alerta => alerta.id !== id));
  };

  const cerrarTodasLasAlertas = () => {
    setAlertas([]);
  };

  // Funciones de conveniencia
  const mostrarError = (mensaje, opciones) => mostrarAlerta(mensaje, 'error', opciones);
  const mostrarExito = (mensaje, opciones) => mostrarAlerta(mensaje, 'exito', opciones);
  const mostrarInfo = (mensaje, opciones) => mostrarAlerta(mensaje, 'info', opciones);
  const mostrarAdvertencia = (mensaje, opciones) => mostrarAlerta(mensaje, 'advertencia', opciones);

  return (
    <AlertaContext.Provider
      value={{
        alertas,
        mostrarAlerta,
        cerrarAlerta,
        cerrarTodasLasAlertas,
        mostrarError,
        mostrarExito,
        mostrarInfo,
        mostrarAdvertencia,
      }}
    >
      {children}
      
      {/* Renderizar alertas flotantes usando portal */}
      {typeof window !== 'undefined' && createPortal(
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 lg:bottom-6 z-[9999] space-y-3 pointer-events-none px-4 w-full max-w-md">
          {alertas
            .filter(alerta => alerta.flotante !== false)
            .map((alerta) => (
              <div key={alerta.id} className="pointer-events-auto">
                <Alerta
                  mensaje={alerta.mensaje}
                  tipo={alerta.tipo}
                  onCerrar={() => cerrarAlerta(alerta.id)}
                  autoOcultar={alerta.autoOcultar}
                  duracion={alerta.duracion}
                  flotante={false} // Ya está en contenedor flotante
                />
              </div>
            ))}
        </div>,
        document.body
      )}
    </AlertaContext.Provider>
  );
};
