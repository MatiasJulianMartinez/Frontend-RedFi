import { supabase } from "../../supabase/client";

export const obtenerTecnologiasDisponibles = async (
  mostrarAlerta = () => {}
) => {
  const { data, error } = await supabase
    .from("tecnologias")
    .select("id, tecnologia");
  if (error) {
    mostrarAlerta("Error al obtener tecnologías disponibles");
    throw error;
  }
  return data;
};

export const obtenerZonasDisponibles = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("zonas")
    .select("id, departamento");
  if (error) {
    mostrarAlerta("Error al obtener zonas disponibles");
    throw error;
  }
  return data;
};