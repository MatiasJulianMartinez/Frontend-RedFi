import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  obtenerSesionActual,
  escucharCambiosDeSesion,
} from "../services/authService";

// Contexto principal para el sistema de autenticación
const AuthContext = createContext();

/**
 * Hook personalizado para acceder fácilmente al contexto de autenticación
 * Simplifica el acceso al estado del usuario y carga desde cualquier componente
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Proveedor del contexto de autenticación
 * Maneja la carga inicial de la sesión y escucha cambios en tiempo real
 */
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado (null si no hay sesión activa)
  const [usuario, setUsuario] = useState(null);
  // Estado de carga para mostrar loaders mientras se verifica la sesión
  const [loading, setLoading] = useState(true);

  // Ref para prevenir cambios duplicados
  const lastUserRef = useRef(null);
  const timeoutRef = useRef(null);

  // Función inteligente para actualizar el usuario
  const updateUser = useCallback((newUser, isImmediate = false) => {
    // Solo actualizar si el usuario realmente cambió
    const userIdChanged = lastUserRef.current?.id !== newUser?.id;
    const userStatusChanged = Boolean(lastUserRef.current) !== Boolean(newUser);

    if (userIdChanged || userStatusChanged) {
      const updateAction = () => {
        console.log(
          "Estado de sesión cambiado:",
          newUser ? "Logged in" : "Logged out"
        );
        lastUserRef.current = newUser;
        setUsuario(newUser);
      };

      if (isImmediate) {
        // Para login/logout inmediatos, no usar debounce
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        updateAction();
      } else {
        // Para cambios subsecuentes, usar debounce
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(updateAction, 100);
      }
    } else {
      console.log("Cambio de estado de autenticación ignorado (duplicado)");
    }
  }, []);

  // Efecto para cargar la sesión inicial y configurar el listener de cambios
  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones si el componente se desmonta

    /**
     * Función para cargar la sesión actual al inicializar el contexto
     * Maneja errores de conexión y actualiza el estado de carga
     */
    const cargarSesion = async () => {
      try {
        // Intenta obtener la sesión actual desde Supabase
        const session = await obtenerSesionActual();
        // Solo actualiza el estado si el componente sigue montado
        if (isMounted) {
          const user = session?.user || null;
          lastUserRef.current = user;
          setUsuario(user);
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error.message);
      } finally {
        // Termina el estado de carga independientemente del resultado
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Ejecuta la carga inicial
    cargarSesion();

    // Configura listener para cambios de sesión en tiempo real
    const suscripcion = escucharCambiosDeSesion((user) => {
      if (isMounted) {
        // Los cambios del listener van con debounce normal
        updateUser(user, false);
      }
    });

    // Cleanup: cancela la suscripción cuando el componente se desmonta
    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      suscripcion.unsubscribe();
    };
  }, []); // Array vacío = solo se ejecuta una vez al montar

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(
    () => ({
      usuario,
      loading,
    }),
    [usuario, loading]
  );

  // Proporciona el estado de autenticación a toda la aplicación
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
