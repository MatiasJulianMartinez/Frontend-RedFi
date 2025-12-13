import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { getPerfil } from "../services/perfil/getPerfil";

// Contexto principal para el sistema de roles y planes
const RoleContext = createContext();

/**
 * Hook personalizado para acceder al contexto de roles
 * Simplifica el acceso a roles, planes y funciones de verificación de permisos
 */
export const useRole = () => useContext(RoleContext);

/**
 * Proveedor del contexto de roles y planes
 * Carga los datos del perfil del usuario y proporciona funciones de verificación de acceso
 */
export const RoleProvider = ({ children }) => {
  // Estado del rol del usuario (admin/user)
  const [rol, setRol] = useState(null);
  // Estado del plan de suscripción (basico/premium)
  const [plan, setPlan] = useState(null);
  // Estado de carga específico para datos de roles
  const [loadingRole, setLoadingRole] = useState(true);
  // Obtiene el usuario y estado de carga del contexto de autenticación
  const { usuario, loading } = useAuth();

  // Ref para evitar condiciones de carrera entre múltiples lecturas del perfil
  const latestReq = useRef(0);

  // Función reutilizable que carga el perfil y aplica anti-carrera
  const cargarPerfilSeguro = useCallback(async (user) => {
    // Si no hay usuario, limpia los estados y termina la carga
    if (!user) {
      setRol(null);
      setPlan(null);
      setLoadingRole(false);
      return;
    }

    setLoadingRole(true);
    const reqId = ++latestReq.current;

    try {
      // Obtiene el perfil completo del usuario desde la base de datos
      // Si tu getPerfil acepta userId, pásalo: getPerfil(user.id)
      const perfil = await getPerfil();

      // Aplica los datos solo si esta respuesta es la más reciente
      if (reqId === latestReq.current) {
        // Actualiza los estados con los datos del perfil o null si no existen
        setRol(perfil?.rol || null);
        setPlan(perfil?.plan || null);
      }
    } catch (error) {
      // En caso de error, limpia los estados (solo si es la respuesta vigente)
      if (reqId === latestReq.current) {
        console.error("Error al obtener el perfil del usuario:", error.message);
        setRol(null);
        setPlan(null);
      }
    } finally {
      if (reqId === latestReq.current) setLoadingRole(false);
    }
  }, []);

  // Efecto para cargar datos del perfil cuando cambia el usuario
  useEffect(() => {
    /**
     * Función para cargar los datos de rol y plan del usuario autenticado
     * Se ejecuta cuando hay cambios en el estado de autenticación
     */
    if (!loading) {
      cargarPerfilSeguro(usuario);
    }
  }, [usuario, loading, cargarPerfilSeguro]); // Se re-ejecuta cuando cambia el usuario o el estado de carga

  // Funciones auxiliares para verificar roles específicos
  const esAdmin = () => rol === "admin";
  const esUser = () => rol === "user";
  const esPremium = () => plan === "premium";
  const esBasico = () => plan === "basico";

  /**
   * Verifica si el usuario tiene acceso según el plan requerido
   * @param {"basico" | "premium"} requierePlan
   * @returns {boolean}
   * Implementa lógica de jerarquía: premium incluye acceso a funciones básicas
   */
  const tieneAcceso = (requierePlan) => {
    if (!requierePlan) return true; // Sin restricción de plan
    if (requierePlan === "basico") return esBasico() || esPremium(); // Básico o superior
    if (requierePlan === "premium") return esPremium(); // Solo premium
    return false;
  };

  /**
   * Función para refrescar manualmente los datos del rol y plan
   * Útil después de actualizaciones de perfil o cambios de suscripción
   */
  const refrescarRol = async () => {
    if (!usuario) return;

    const reqId = ++latestReq.current;
    try {
      setLoadingRole(true);
      // Re-obtiene los datos del perfil desde la base de datos
      const perfil = await getPerfil();

      // Aplica los datos solo si esta respuesta es la más reciente
      if (reqId === latestReq.current) {
        setRol(perfil?.rol || null);
        setPlan(perfil?.plan || null);
      }
    } catch (error) {
      if (reqId === latestReq.current) {
        console.error(
          "Error al refrescar el perfil del usuario:",
          error.message
        );
      }
    } finally {
      if (reqId === latestReq.current) setLoadingRole(false);
    }
  };

  // Proporciona todos los valores y funciones relacionados con roles y planes
  return (
    <RoleContext.Provider
      value={{
        rol, // Rol actual del usuario (admin/user)
        plan, // Plan actual del usuario (basico/premium)
        setPlan, // Función para actualizar el plan directamente
        loadingRole, // Estado de carga de los datos de rol
        esAdmin, // Función para verificar si es admin
        esUser, // Función para verificar si es user
        esPremium, // Función para verificar si tiene plan premium
        esBasico, // Función para verificar si tiene plan básico
        tieneAcceso, // Función para verificar acceso por plan
        refrescarRol, // Función para refrescar datos del perfil
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
