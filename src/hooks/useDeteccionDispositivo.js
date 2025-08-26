import { useState, useEffect } from 'react';

export const useDeteccionDispositivo = () => {
  const [esMobile, setEsMobile] = useState(false);
  const [esMovil, setEsMovil] = useState(false); // Para PWA instalada
  
  useEffect(() => {
    const detectarDispositivo = () => {
      const mobile = window.innerWidth < 1024;
      const esPWA = window.matchMedia('(display-mode: standalone)').matches;
      const esMovilReal = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setEsMobile(mobile);
      setEsMovil(esMovilReal || (mobile && esPWA));
    };

    detectarDispositivo();
    window.addEventListener('resize', detectarDispositivo);
    return () => window.removeEventListener('resize', detectarDispositivo);
  }, []);

  return { 
    esPantallaMovil: esMobile,    // Pantalla pequeña
    esDispositivoMovil: esMovil   // Dispositivo móvil real
  };
};
