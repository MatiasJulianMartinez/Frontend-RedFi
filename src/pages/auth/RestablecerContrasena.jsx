import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconKey, IconLock } from "@tabler/icons-react";

import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import Input from "../../components/ui/Input";

import { useAlerta } from "../../context/AlertaContext";
import { useTheme } from "../../context/ThemeContext";
import { obtenerSesionActual, restablecerPassword, logoutUser } from "../../services/authService";

const RestablecerContrasena = () => {
  useEffect(() => {
    document.title = "Red-Fi | Restablecer Contraseña";
  }, []);

  const { currentTheme } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(true);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const navigate = useNavigate();
  const { mostrarExito, mostrarError } = useAlerta();

  // Verificar que el usuario tenga una sesión válida desde el enlace de recuperación
  useEffect(() => {
    const checkSession = async () => {
      const session = await obtenerSesionActual();
      if (!session) {
        mostrarError(
          "Sesión inválida o expirada. Por favor, solicita un nuevo enlace de recuperación."
        );
        setTimeout(() => {
          navigate("/recuperar-contrasena");
        }, 2000);
        setIsValidSession(false);
      }
    };
    checkSession();
    // Solo ejecutar una vez al montar el componente
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Bloquear navegación si no ha cambiado la contraseña
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Cerrar sesión al desmontar el componente si no cambió la contraseña
  useEffect(() => {
    return () => {
      if (!passwordChanged) {
        logoutUser();
      }
    };
  }, [passwordChanged]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      mostrarError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await restablecerPassword(password);

      // Marcar que la contraseña fue cambiada
      setPasswordChanged(true);

      // Cerrar sesión después de cambiar la contraseña
      await logoutUser();

      mostrarExito(
        "Contraseña actualizada exitosamente. Iniciá sesión con tu nueva contraseña."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      mostrarError(err.message || "Error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="w-full bg-fondo flex items-center justify-center px-4 py-16 relative">
        <div className="w-full max-w-md text-center">
          <p className="text-lg">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-16 relative">
      <div className="w-full max-w-7xl">
        {/* Título */}
        <div className="w-full text-center mb-8">
          <MainH1 icon={IconKey}>Restablecer contraseña</MainH1>
          <p className="text-lg">
            Por seguridad, debés establecer una nueva contraseña.
          </p>
        </div>

        {/* Formulario */}
        <div
          className={`rounded-lg p-6 max-w-md mx-auto
        ${
          currentTheme === "light"
            ? "bg-secundario border-2 border-texto/15 shadow-lg"
            : "bg-texto/5 border border-texto/15"
        } `}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nueva Contraseña"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={IconLock}
            />

            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              placeholder="Debe coincidir con la anterior"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={IconLock}
            />

            <div className="mt-4 p-3">
              <p className="text-sm text-center text-texto/70 italic">
                Debés restablecer tu contraseña para continuar
              </p>
            </div>

            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </MainButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
