import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconKey, IconMail, IconArrowBack } from "@tabler/icons-react";

import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import Input from "../../components/ui/Input";

import { useAlerta } from "../../context/AlertaContext";
import { useTheme } from "../../context/ThemeContext";
import { recuperarPassword } from "../../services/authService";

const Password = () => {
  useEffect(() => {
    document.title = "Red-Fi | Recuperar Contraseña";
  }, []);

  const { currentTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const navigate = useNavigate();
  const { mostrarExito, mostrarError } = useAlerta();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/restablecer-contrasena`;
      
      await recuperarPassword(email, redirectUrl);

      setEmailEnviado(true);
      mostrarExito(
        "Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña."
      );
    } catch (err) {
      mostrarError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-16 relative">
      <div className="w-full max-w-7xl">
        {/* Título */}
        <div className="w-full text-center mb-8">
          <MainH1 icon={IconKey}>Recuperar contraseña</MainH1>
          <p className="text-lg">
            Ingresá tu correo electrónico y te enviaremos las instrucciones.
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
          {!emailEnviado ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={IconMail}
              />
              
              <MainButton
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </MainButton>
            </form>
          ) : (
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="text-primario">
                <IconMail size={48} className="mx-auto mb-4" />
              </div>
              <p className="text-lg font-semibold">
                ¡Correo enviado!
              </p>
              <p className="text-texto text-left">
                Revisá tu bandeja de entrada y seguí las instrucciones para
                restablecer tu contraseña.
              </p>
              <MainButton
                onClick={() => navigate("/login")}
                variant="secondary"
                className="w-full mt-4"
              >
                Volver al inicio de sesión
              </MainButton>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-6 max-w-md mx-auto">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-texto/15"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-fondo text-texto">Si no recibís el correo, revisá tu carpeta de spam.</span>
          </div>
        </div>

        {/* Volver al login */}
        {!emailEnviado && (
          <div className="mt-6 text-center">
            <MainLinkButton
              to="/login"
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              <IconArrowBack />
              Volver al inicio de sesión
            </MainLinkButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Password;
