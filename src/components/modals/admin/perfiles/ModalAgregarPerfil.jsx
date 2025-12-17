import { useState } from "react";
import {
  IconX,
  IconUser,
  IconMail,
  IconLock,
  IconShield,
  IconCrown,
  IconBuilding,
} from "@tabler/icons-react";
import MainH2 from "../../../ui/MainH2";
import MainButton from "../../../ui/MainButton";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import FileInput from "../../../ui/FileInput";
import ModalContenedor from "../../../ui/ModalContenedor";
import { useAlerta } from "../../../../context/AlertaContext";
import {
  crearUsuarioCompleto,
  procesarMensajeError,
  validarFormularioUsuario,
} from "../../../../services/perfil/adminPerfil";

const ModalAgregarPerfil = ({ onClose, onActualizar }) => {
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("user");
  const [plan, setPlan] = useState("basico");
  const [proveedorPreferido, setProveedorPreferido] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [nombreInvalido, setNombreInvalido] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [contrasenaInvalida, setContrasenaInvalida] = useState(false);

  const { mostrarError, mostrarExito } = useAlerta();

  // Opciones para selects
  const rolesOptions = [
    { value: "user", label: "Usuario" },
    { value: "admin", label: "Administrador" },
  ];

  const planesOptions = [
    { value: "basico", label: "Básico" },
    { value: "premium", label: "Premium" },
  ];

  // Crear usuario
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    if (!email.trim() || !nombre.trim() || !contrasena.trim()) return;

    // Resetear estados de validación
    setNombreInvalido(false);
    setEmailInvalido(false);
    setContrasenaInvalida(false);

    setLoading(true);

    try {
      // Crear usuario completo con imagen usando el servicio consolidado
      await crearUsuarioCompleto(
        {
          email: email.trim(),
          contrasena: contrasena.trim(),
          nombre: nombre.trim(),
          rol,
          plan,
          proveedor_preferido: proveedorPreferido.trim() || null,
        },
        fotoFile
      ); // Pasar la imagen como segundo parámetro

      mostrarExito(`Usuario ${nombre} creado exitosamente`);

      // Actualizar lista de usuarios en el componente padre
      if (onActualizar) {
        onActualizar();
      }

      // Cerrar el modal después de crear exitosamente
      onClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      const mensajeProcesado = procesarMensajeError(
        error.message || "Error al crear el usuario",
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

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <MainH2 className="mb-0">Agregar usuario</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
          disabled={loading}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      {/* Formulario de creación */}
      <form onSubmit={handleCrearUsuario} className="space-y-2 md:space-y-4">
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
            placeholder="Tu nombre completo"
            required
            icon={IconUser}
            maxLength={40}
            showCounter={true}
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
            placeholder="ejemplo@ejemplo.com"
            required
            icon={IconMail}
            isInvalid={emailInvalido}
          />

          {/* Contraseña */}
          <Input
            label={
              <>
                Contraseña <span className="text-red-600">*</span>
              </>
            }
            type="password"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              if (contrasenaInvalida) setContrasenaInvalida(false);
            }}
            placeholder="Mínimo 6 caracteres"
            required
            icon={IconLock}
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
              />
            </div>
          </div>
          {/* Proveedor preferido */}
          <Input
            label="Proveedor preferido"
            type="text"
            value={proveedorPreferido}
            onChange={(e) => setProveedorPreferido(e.target.value)}
            placeholder="Telecom, Movistar, etc."
            icon={IconBuilding}
          />

          <FileInput
            label="Imagen de perfil"
            value={fotoFile}
            onChange={setFotoFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            accept="image/*"
            disabled={loading}
          />
        </div>
        {/* Botones de acción */}
        <div className="flex gap-3">
          <MainButton
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            Crear usuario
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

export default ModalAgregarPerfil;
