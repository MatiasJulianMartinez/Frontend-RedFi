import { useMemo } from 'react';

/**
 * Hook para calcular filtros dinámicos basados en las selecciones actuales
 * @param {Array} todasLasZonas - Todas las zonas disponibles
 * @param {Array} todosLosProveedores - Todos los proveedores disponibles  
 * @param {Array} todasLasTecnologias - Todas las tecnologías disponibles
 * @param {Object} filtrosActuales - Los filtros actualmente seleccionados
 * @returns {Object} Objeto con opciones filtradas dinámicamente
 */
export const useFiltrosDinamicos = (
  todasLasZonas,
  todosLosProveedores,
  todasLasTecnologias,
  filtrosActuales
) => {
  
  const filtrosDinamicos = useMemo(() => {
    // Si no hay datos, retornar todo tal como está
    if (!todasLasZonas || !todosLosProveedores || !todasLasTecnologias) {
      return {
        zonasDisponibles: todasLasZonas || [],
        proveedoresDisponibles: todosLosProveedores || [],
        tecnologiasDisponibles: todasLasTecnologias || [],
      };
    }

    // Crear sets de IDs para filtrar
    let zonasPermitidas = new Set();
    let proveedoresPermitidos = new Set();
    let tecnologiasPermitidas = new Set();

    // 1. Si hay una zona seleccionada, filtrar proveedores y tecnologías disponibles en esa zona
    if (filtrosActuales.zona?.id) {
      const zonaSeleccionada = todasLasZonas.find(z => z.id === filtrosActuales.zona.id);
      
      if (zonaSeleccionada) {
        // Buscar todos los proveedores que operan en esta zona
        const proveedoresEnZona = todosLosProveedores.filter(prov => 
          prov.ZonaProveedor?.some(zp => zp.zonas?.id === zonaSeleccionada.id)
        );
        
        proveedoresEnZona.forEach(prov => proveedoresPermitidos.add(prov.id));
        
        // Tecnologías disponibles por estos proveedores
        proveedoresEnZona.forEach(prov => {
          prov.ProveedorTecnologia?.forEach(pt => {
            if (pt.tecnologias?.tecnologia) {
              tecnologiasPermitidas.add(pt.tecnologias.tecnologia);
            }
          });
        });
      }
    }
    
    // 2. Si hay un proveedor seleccionado, filtrar zonas y tecnologías donde opera ese proveedor
    if (filtrosActuales.proveedor?.id) {
      const proveedorSeleccionado = todosLosProveedores.find(p => p.id === filtrosActuales.proveedor.id);
      
      if (proveedorSeleccionado) {
        // Zonas donde opera este proveedor
        proveedorSeleccionado.ZonaProveedor?.forEach(zp => {
          if (zp.zonas?.id) {
            zonasPermitidas.add(zp.zonas.id);
          }
        });
        
        // Tecnologías de este proveedor
        proveedorSeleccionado.ProveedorTecnologia?.forEach(pt => {
          if (pt.tecnologias?.tecnologia) {
            tecnologiasPermitidas.add(pt.tecnologias.tecnologia);
          }
        });
      }
    }

    // 3. Si hay una tecnología seleccionada, filtrar proveedores y zonas que la soporten
    if (filtrosActuales.tecnologia) {
      const proveedoresConTecnologia = todosLosProveedores.filter(prov =>
        prov.ProveedorTecnologia?.some(pt => pt.tecnologias?.tecnologia === filtrosActuales.tecnologia)
      );
      
      proveedoresConTecnologia.forEach(prov => {
        proveedoresPermitidos.add(prov.id);
        
        // Zonas donde opera este proveedor
        prov.ZonaProveedor?.forEach(zp => {
          if (zp.zonas?.id) {
            zonasPermitidas.add(zp.zonas.id);
          }
        });
      });
    }

    // Si no hay filtros aplicados, mostrar todas las opciones
    const tieneAlgunFiltro = filtrosActuales.zona?.id || filtrosActuales.proveedor?.id || filtrosActuales.tecnologia;
    
    if (!tieneAlgunFiltro) {
      // Poblar todos los sets con todas las opciones
      todasLasZonas.forEach(z => zonasPermitidas.add(z.id));
      todosLosProveedores.forEach(p => proveedoresPermitidos.add(p.id));
      todasLasTecnologias.forEach(t => tecnologiasPermitidas.add(t));
    }

    // Construir arrays filtrados
    const zonasDisponibles = todasLasZonas.filter(zona => zonasPermitidas.has(zona.id));
    const proveedoresDisponibles = todosLosProveedores.filter(prov => proveedoresPermitidos.has(prov.id));
    const tecnologiasDisponibles = todasLasTecnologias.filter(tech => tecnologiasPermitidas.has(tech));

    return {
      zonasDisponibles: zonasDisponibles.length > 0 ? zonasDisponibles : todasLasZonas,
      proveedoresDisponibles: proveedoresDisponibles.length > 0 ? proveedoresDisponibles : todosLosProveedores,
      tecnologiasDisponibles: tecnologiasDisponibles.length > 0 ? tecnologiasDisponibles : todasLasTecnologias,
    };

  }, [todasLasZonas, todosLosProveedores, todasLasTecnologias, filtrosActuales]);

  return filtrosDinamicos;
};
