import { useEffect, useState } from "react";
import {
  IconX,
  IconUser,
  IconMail,
  IconShield,
  IconLock,
  IconCrown,
  IconBuilding,
} from "@tabler/icons-react";
import ModalContenedor from "../../../ui/ModalContenedor";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import FileInput from "../../../ui/FileInput";
import {
  editarUsuario,
  subirImagenPerfil,
  eliminarImagenPerfilPorURL,
  procesarMensajeError,
  obtenerUsuarioCompletoPorId,
} from "../../../../services/perfil/adminPerfil";
import { useAlerta } from "../../../../context/AlertaContext";

const ModalEditarPerfil = ({ perfil, onClose, onActualizar }) => {
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("user");
  const [plan, setPlan] = useState("basico");
  const [proveedorPreferido, setProveedorPreferido] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [nombreInvalido, setNombreInvalido] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [contrasenaInvalida, setContrasenaInvalida] = useState(false);
  const { mostrarExito, mostrarError } = useAlerta();

  // Opciones para selects
  const rolesOptions = cargandoInicial
    ? [{ value: "", label: "Cargando..." }]
    : [
        { value: "user", label: "Usuario" },
        { value: "admin", label: "Administrador" },
      ];

  const planesOptions = cargandoInicial
    ? [{ value: "", label: "Cargando..." }]
    : [
        { value: "basico", label: "Básico" },
        { value: "premium", label: "Premium" },
      ];

  // Cargar datos del perfil al abrir el modal (incluyendo email)
  useEffect(() => {
    const cargarUsuarioCompleto = async () => {
      if (perfil && perfil.id) {
        setCargandoInicial(true);
        try {
          const usuarioCompleto = await obtenerUsuarioCompletoPorId(perfil.id);
          setEmail(usuarioCompleto.email || "");
          setNombre(usuarioCompleto.nombre || "");
          setRol(usuarioCompleto.rol || "user");
          setPlan(usuarioCompleto.plan || "basico");
          setProveedorPreferido(usuarioCompleto.proveedor_preferido || "");
          setPreviewUrl(usuarioCompleto.foto_url || null);
          setFotoFile(null);
          setContrasena(""); // No mostrar contraseña actual
        } catch (error) {
          console.error("Error al cargar usuario:", error);
          mostrarError("Error al cargar los datos del usuario");
          // Usar datos básicos del perfil si falla
          setEmail(perfil.email || "");
          setNombre(perfil.nombre || "");
          setRol(perfil.rol || "user");
          setPlan(perfil.plan || "basico");
          setProveedorPreferido(perfil.proveedor_preferido || "");
          setPreviewUrl(perfil.foto_url || null);
          setFotoFile(null);
        } finally {
          setCargandoInicial(false);
        }
      } else {
        // Si no hay perfil, marcar como cargado
        setCargandoInicial(false);
      }
    };

    cargarUsuarioCompleto();
  }, [perfil, mostrarError]);

  // Editar usuario
  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    if (!email.trim() || !nombre.trim()) return;

    // Resetear estados de validación
    setNombreInvalido(false);
    setEmailInvalido(false);
    setContrasenaInvalida(false);

    setLoading(true);

    try {
      // Preparar datos básicos para actualizar
      const datosActualizados = {
        email: email.trim(),
        nombre: nombre.trim(),
        rol,
        plan,
        proveedor_preferido: proveedorPreferido.trim() || null,
      };

      // Agregar contraseña solo si se proporcionó
      if (contrasena.trim()) {
        datosActualizados.contrasena = contrasena.trim();
      }

      // Manejo completo de imagen: nueva, eliminar o mantener
      const imagenOriginal = perfil.foto_url;

      // Caso 1: Usuario eliminó la imagen (no hay preview ni archivo)
      if (!previewUrl && !fotoFile && imagenOriginal) {
        console.log("Eliminando imagen del usuario");
        try {
          await eliminarImagenPerfilPorURL(imagenOriginal);
          console.log("Imagen eliminada exitosamente");
          datosActualizados.foto_url = null;
        } catch (deleteError) {
          console.warn("No se pudo eliminar imagen:", deleteError);
          // No fallar el proceso, solo mantener la imagen actual
        }
      }
      // Caso 2: Usuario subió nueva imagen
      else if (fotoFile && previewUrl?.startsWith("data:")) {
        console.log("Subiendo nueva imagen para usuario ID:", perfil.id);
        try {
          // 1. Subir nueva imagen PRIMERO
          const nuevaFotoUrl = await subirImagenPerfil(fotoFile, perfil.id);
          console.log("Nueva imagen subida:", nuevaFotoUrl);

          datosActualizados.foto_url = nuevaFotoUrl;

          // 2. Eliminar imagen antigua DESPUÉS del éxito
          if (imagenOriginal && imagenOriginal !== nuevaFotoUrl) {
            try {
              console.log("Eliminando imagen anterior:", imagenOriginal);
              await eliminarImagenPerfilPorURL(imagenOriginal);
              console.log("Imagen anterior eliminada");
            } catch (deleteError) {
              console.warn("No se pudo eliminar imagen anterior:", deleteError);
              // No fallar el proceso si no se puede eliminar la anterior
            }
          }
        } catch (uploadError) {
          console.error("Error al subir nueva imagen:", uploadError);
          throw uploadError;
        }
      }
      // Caso 3: No hay cambios en la imagen, mantener actual

      // Actualizar usuario usando el servicio consolidado
      await editarUsuario(perfil.id, datosActualizados);

      mostrarExito(`Usuario ${nombre} actualizado exitosamente`);

      // Disparar evento para actualizar la navbar si es el usuario logueado
      window.dispatchEvent(new CustomEvent("perfil-actualizado"));

      // Actualizar lista de usuarios en el componente padre
      if (onActualizar) {
        onActualizar();
      }

      // Cerrar el modal después de actualizar exitosamente
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      const mensajeProcesado = procesarMensajeError(
        error.message || "Error al actualizar el usuario",
        email
      );
      mostrarError(mensajeProcesado);

      // Marcar campos como inválidos según el error
      const errorMsg = error.message || "";
      if (errorMsg.includes("nombre")) setNombreInvalido(true);
      if (errorMsg.includes("email") || errorMsg.includes("Email")) setEmailInvalido(true);
      if (errorMsg.includes("contraseña")) setContrasenaInvalida(true);
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) return null;

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado del modal */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Editar perfil</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={false}
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Formulario de edición */}
      <form onSubmit={handleEditarUsuario} className="space-y-2 md:space-y-4">
        {/* Información básica */}
        <div className="space-y-2 md:space-y-4">
          {/* Nombre */}
          <Input
            label={
              <>
                Nombre completo <span className="text-red-600">*</span>
              </>
            }
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (nombreInvalido) setNombreInvalido(false);
            }}
            placeholder={cargandoInicial ? "Cargando..." : "Tu nombre completo"}
            required
            icon={IconUser}
            maxLength={40}
            showCounter={true}
            disabled={loading || cargandoInicial}
            isInvalid={nombreInvalido}
          />

          {/* Email */}
          <Input
            label={
              <>
                Email <span className="text-red-600">*</span>
              </>
            }
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailInvalido) setEmailInvalido(false);
            }}
            placeholder={
              cargandoInicial ? "Cargando..." : "usuario@ejemplo.com"
            }
            required
            icon={IconMail}
            disabled={loading || cargandoInicial}
            isInvalid={emailInvalido}
          />

          {/* Contraseña */}
          <Input
            label="Nueva contraseña"
            type="password"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              if (contrasenaInvalida) setContrasenaInvalida(false);
            }}
            placeholder={cargandoInicial ? "Cargando..." : "Dejar vacío para no cambiar (mínimo 6 caracteres)"}
            icon={IconLock}
            disabled={loading || cargandoInicial}
            isInvalid={contrasenaInvalida}
          />
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              {/* Rol */}
              <Select
                label="Rol"
                value={rol}
                onChange={setRol}
                options={rolesOptions}
                getOptionValue={(opt) => opt.value}
                getOptionLabel={(opt) => opt.label}
                icon={IconShield}
                disabled={loading || cargandoInicial}
              />
            </div>

            <div className="flex-1">
              {/* Plan */}
              <Select
                label="Plan"
                value={plan}
                onChange={setPlan}
                options={planesOptions}
                getOptionValue={(opt) => opt.value}
                getOptionLabel={(opt) => opt.label}
                icon={IconCrown}
                className="flex-1"
                disabled={loading || cargandoInicial}
              />
            </div>
          </div>

          {/* Proveedor preferido */}
          <Input
            label="Proveedor preferido"
            type="text"
            value={proveedorPreferido}
            onChange={(e) => setProveedorPreferido(e.target.value)}
            placeholder={
              cargandoInicial ? "Cargando..." : "Telecom, Movistar, etc."
            }
            icon={IconBuilding}
            disabled={loading || cargandoInicial}
          />

          <FileInput
            label="Imagen de perfil"
            value={fotoFile}
            onChange={setFotoFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            accept="image/*"
            disabled={loading || cargandoInicial}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <MainButton
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={false}
          >
            Cancelar
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || cargandoInicial}
            className="flex-1"
          >
            Actualizar usuario
          </MainButton>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-texto/75 italic">
            Los campos marcados con <span className="text-red-600">*</span> son
            obligatorios.
          </p>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalEditarPerfil;
