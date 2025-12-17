import { supabase } from "../../supabase/client";
import { supabaseAdmin } from "../../supabase/adminClient";

// ====== FUNCIONES DE GESTIÓN DE PERFILES ======

// Obtiene todos los perfiles ordenados alfabéticamente (uso admin)
export const obtenerPerfilesAdmin = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, nombre, proveedor_preferido, rol, plan, foto_url")
    .order("nombre", { ascending: true });

  if (error) {
    mostrarAlerta("Error al obtener los perfiles.");
    throw error;
  }
  return data;
};

// Actualiza solo plan (y opcionalmente rol) de un usuario
export const actualizarPlanUsuario = async (
  usuarioId,
  nuevoPlan,
  nuevoRol = null
) => {
  const actualizacion = { plan: nuevoPlan };
  if (nuevoRol) actualizacion.rol = nuevoRol;

  const { error } = await supabase
    .from("user_profiles")
    .update(actualizacion)
    .eq("id", usuarioId);

  if (error) {
    throw new Error(error.message);
  }
};

// ====== FUNCIONES DE GESTIÓN ADMINISTRATIVA DE USUARIOS ======

/**
 * Subir imagen a Storage con validaciones completas
 * @param {File} archivo - Archivo de imagen
 * @param {string} userId - ID del usuario
 * @returns {string|null} URL pública de la imagen subida
 */
export const subirImagenPerfil = async (archivo, userId) => {
  if (!archivo) return null;

  // Validación de tipo de archivo
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
  if (!tiposPermitidos.includes(archivo.type)) {
    throw new Error("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
  }

  // Validación de tamaño (300KB)
  const MAX_TAMANO_BYTES = 300 * 1024;
  if (archivo.size > MAX_TAMANO_BYTES) {
    throw new Error("La imagen supera los 300 KB permitidos.");
  }

  // Validación de resolución
  await new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      const tooBig = img.width > 500 || img.height > 500;
      URL.revokeObjectURL(url);
      if (tooBig) {
        reject(new Error("La resolución máxima permitida es 500x500 píxeles."));
      } else {
        resolve(true);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo procesar la imagen."));
    };
    img.src = url;
  });

  // Subir archivo a Storage
  const carpetaUsuario = `${userId}`;
  const nombreArchivo = `perfil-${Date.now()}`;
  const rutaCompleta = `${carpetaUsuario}/${nombreArchivo}`;

  const { error: uploadError } = await supabase.storage
    .from("perfiles")
    .upload(rutaCompleta, archivo, {
      cacheControl: "3600",
      upsert: true,
      contentType: archivo.type,
    });

  if (uploadError) {
    throw new Error("Error al subir la imagen al servidor.");
  }

  // Obtener URL pública
  const { data } = supabase.storage.from("perfiles").getPublicUrl(rutaCompleta);

  return data.publicUrl;
};

/**
 * Eliminar imagen de perfil por URL
 * @param {string} imageUrl - URL de la imagen a eliminar
 * @returns {void}
 */
export const eliminarImagenPerfilPorURL = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.findIndex((part) => part === "perfiles");
    if (bucketIndex === -1) {
      throw new Error("URL de imagen inválida");
    }

    const imagePath = pathParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from("perfiles")
      .remove([imagePath]);

    if (error) {
      console.error("Error al eliminar imagen por URL:", error);
      throw error;
    }

    console.log("Imagen de perfil eliminada:", imagePath);
  } catch (error) {
    console.error("Error al procesar URL de imagen:", error);
    throw error;
  }
};

/**
 * Procesar mensajes de error para mostrar en español
 * @param {string} errorMessage - Mensaje de error original
 * @param {string} email - Email para contexto
 * @returns {string} Mensaje de error procesado
 */
export const procesarMensajeError = (errorMessage, email = "") => {
  // Detectar errores comunes y convertirlos a español
  if (
    errorMessage.includes(
      "A user with this email address has already been registered"
    )
  ) {
    return `El email ${email} ya está registrado en el sistema. Por favor, usa un email diferente.`;
  }

  if (errorMessage.includes("Invalid email")) {
    return "El formato del email no es válido. Verifica que esté escrito correctamente.";
  }

  if (errorMessage.includes("Password should be at least 6 characters")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (errorMessage.includes("Unable to validate email address")) {
    return "No se pudo validar el email. Verifica que el email esté escrito correctamente.";
  }

  if (errorMessage.includes("Signup is disabled")) {
    return "El registro de usuarios está deshabilitado temporalmente.";
  }

  if (errorMessage.includes("user_profiles_rol_check")) {
    return "El rol seleccionado no es válido. Selecciona 'Usuario' o 'Administrador'.";
  }

  if (errorMessage.includes("violates check constraint")) {
    return "Los datos ingresados no cumplen con las restricciones del sistema. Verifica la información.";
  }

  if (errorMessage.includes("Formato de imagen no soportado")) {
    return "El formato de la imagen no es compatible. Usa archivos JPG, PNG o WEBP.";
  }

  if (errorMessage.includes("supera los 300 KB")) {
    return "La imagen es muy grande. El tamaño máximo permitido es 300 KB.";
  }

  if (errorMessage.includes("resolución máxima permitida")) {
    return "La imagen es muy grande. La resolución máxima permitida es 500x500 píxeles.";
  }

  if (errorMessage.includes("Error al subir la imagen")) {
    return "No se pudo subir la imagen. Intenta nuevamente con otra imagen.";
  }

  // Para otros errores, usar el mensaje original pero mejorado
  return errorMessage.replace(
    "Error al crear usuario en auth: ",
    "Error al crear usuario: "
  );
};

/**
 * Validar datos del formulario de usuario
 * @param {Object} datos - Datos a validar
 * @returns {Array} Array de errores encontrados
 */
export const validarFormularioUsuario = (datos) => {
  const { email, nombre, contrasena } = datos;
  const errores = [];

  if (!email.trim()) {
    errores.push("El email es obligatorio");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errores.push("El email no tiene un formato válido");
  }

  if (!nombre.trim()) {
    errores.push("El nombre es obligatorio");
  } else if (nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }

  if (!contrasena.trim()) {
    errores.push("La contraseña es obligatoria");
  } else if (contrasena.trim().length < 6) {
    errores.push("La contraseña debe tener al menos 6 caracteres");
  }

  return errores;
};

/**
 * Crear un usuario completo (auth + perfil + imagen)
 * @param {Object} datosUsuario - Datos del usuario a crear
 * @param {File|null} imagenArchivo - Archivo de imagen opcional
 * @returns {Object} Usuario creado con credenciales
 */
export const crearUsuarioCompleto = async (
  datosUsuario,
  imagenArchivo = null
) => {
  const {
    email,
    contrasena,
    nombre,
    rol = "user",
    plan = "basico",
    proveedor_preferido,
  } = datosUsuario;

  // Validaciones básicas
  if (!email || !nombre) {
    throw new Error("Email y nombre son campos obligatorios");
  }

  if (nombre.length < 3) {
    throw new Error("El nombre debe tener al menos 3 caracteres");
  }

  if (!contrasena || contrasena.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  try {
    // 1. Crear usuario en auth.users usando Admin API
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: contrasena,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          nombre,
          rol,
          plan,
        },
      });

    if (authError) {
      throw new Error(`Error al crear usuario en auth: ${authError.message}`);
    }

    // 2. Subir imagen si existe
    let foto_url = null;
    if (imagenArchivo) {
      foto_url = await subirImagenPerfil(imagenArchivo, authUser.user.id);
    }

    // 3. Crear perfil en user_profiles
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: authUser.user.id, // Usar el ID del usuario auth
        nombre,
        email,
        rol,
        plan,
        proveedor_preferido,
        foto_url,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (perfilError) {
      // Si falla la creación del perfil, eliminar el usuario auth
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Error al crear perfil: ${perfilError.message}`);
    }

    // Retornar datos del usuario creado (incluyendo credenciales)
    return {
      usuario: perfil,
      credenciales: {
        email,
        contrasena,
      },
      auth_id: authUser.user.id,
    };
  } catch (error) {
    console.error("Error en crearUsuarioCompleto:", error);
    throw error;
  }
};

/**
 * Obtener usuario completo por ID (incluyendo email de auth.users)
 * @param {string} userId - ID del usuario
 * @returns {Object} Usuario completo con email
 */
export const obtenerUsuarioCompletoPorId = async (userId) => {
  try {
    // Obtener perfil
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (perfilError) {
      throw new Error(`Error al obtener perfil: ${perfilError.message}`);
    }

    // Obtener email del auth.users
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError) {
      console.warn("Error al obtener email del usuario:", authError.message);
      // Si no se puede obtener el email, devolver el perfil sin email
      return perfil;
    }

    // Combinar datos del perfil con el email
    return {
      ...perfil,
      email: authUser.user.email,
    };
  } catch (error) {
    console.error("Error en obtenerUsuarioCompletoPorId:", error);
    throw error;
  }
};

/**
 * Editar usuario existente
 * @param {string} userId - ID del usuario
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Object} Usuario actualizado
 */
export const editarUsuario = async (userId, datosActualizados) => {
  // Validaciones básicas
  if (datosActualizados.nombre && datosActualizados.nombre.length < 3) {
    throw new Error("El nombre debe tener al menos 3 caracteres");
  }

  if (datosActualizados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosActualizados.email)) {
    throw new Error("El formato del email no es válido");
  }

  if (datosActualizados.contrasena && datosActualizados.contrasena.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  try {
    // Extraer contraseña de datosActualizados para manejarla por separado
    const { contrasena, ...datosPerfilActualizados } = datosActualizados;

    // Actualizar perfil en user_profiles
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from("user_profiles")
      .update({
        ...datosPerfilActualizados,
      })
      .eq("id", userId)
      .select()
      .single();

    if (perfilError) {
      throw new Error(`Error al actualizar perfil: ${perfilError.message}`);
    }

    // Preparar datos para actualizar en auth
    const authUpdateData = {
      user_metadata: {
        nombre: datosActualizados.nombre || perfil.nombre,
        rol: datosActualizados.rol || perfil.rol,
        plan: datosActualizados.plan || perfil.plan,
      },
    };

    // Si se actualiza el email, agregarlo
    if (datosActualizados.email) {
      authUpdateData.email = datosActualizados.email;
    }

    // Si se proporciona contraseña, agregarla
    if (contrasena) {
      authUpdateData.password = contrasena;
    }

    // Actualizar en auth si hay cambios
    if (datosActualizados.email || contrasena) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, authUpdateData);

      if (authError) {
        console.warn("Error al actualizar auth:", authError.message);
        throw new Error(`Error al actualizar credenciales: ${authError.message}`);
      }
    }

    return perfil;
  } catch (error) {
    console.error("Error en editarUsuario:", error);
    throw error;
  }
};

/**
 * Eliminar usuario completo (auth + perfil + archivos)
 * @param {string} userId - ID del usuario a eliminar
 * @returns {boolean} Éxito de la operación
 */
export const eliminarUsuarioCompleto = async (userId) => {
  try {
    console.log(`Iniciando eliminación completa del usuario: ${userId}`);

    // 1. Obtener boletas del usuario para eliminar sus imágenes
    const { data: boletas, error: boletasError } = await supabaseAdmin
      .from("boletas")
      .select("*")
      .eq("user_id", userId);

    if (boletasError) {
      console.warn(
        "Error al obtener boletas del usuario:",
        boletasError.message
      );
    }

    // 2. Eliminar todas las boletas del usuario de la base de datos
    if (boletas && boletas.length > 0) {
      const { error: deleteBoletasError } = await supabaseAdmin
        .from("boletas")
        .delete()
        .eq("user_id", userId);

      if (deleteBoletasError) {
        console.warn(
          "Error al eliminar boletas de la base de datos:",
          deleteBoletasError.message
        );
      } else {
        console.log(`Eliminadas ${boletas.length} boletas de la base de datos`);
      }
    }

    // 3. Eliminar todos los archivos del usuario en el bucket 'perfiles'
    try {
      const { data: archivosPerfiles, error: listPerfilesError } =
        await supabaseAdmin.storage.from("perfiles").list(userId);

      if (
        !listPerfilesError &&
        archivosPerfiles &&
        archivosPerfiles.length > 0
      ) {
        const rutasPerfiles = archivosPerfiles.map(
          (archivo) => `${userId}/${archivo.name}`
        );
        const { error: removePerfilesError } = await supabaseAdmin.storage
          .from("perfiles")
          .remove(rutasPerfiles);

        if (removePerfilesError) {
          console.warn(
            "Error al eliminar archivos de perfiles:",
            removePerfilesError.message
          );
        } else {
          console.log(
            `Eliminados ${rutasPerfiles.length} archivos del bucket perfiles`
          );
        }
      }
    } catch (error) {
      console.warn("Error al eliminar archivos de perfiles:", error.message);
    }

    // 4. Eliminar todos los archivos del usuario en el bucket 'boletas'
    try {
      const { data: archivosBoletas, error: listBoletasError } =
        await supabaseAdmin.storage.from("boletas").list(userId);

      if (!listBoletasError && archivosBoletas && archivosBoletas.length > 0) {
        const rutasBoletas = archivosBoletas.map(
          (archivo) => `${userId}/${archivo.name}`
        );
        const { error: removeBoletasError } = await supabaseAdmin.storage
          .from("boletas")
          .remove(rutasBoletas);

        if (removeBoletasError) {
          console.warn(
            "Error al eliminar archivos de boletas:",
            removeBoletasError.message
          );
        } else {
          console.log(
            `Eliminados ${rutasBoletas.length} archivos del bucket boletas`
          );
        }
      }
    } catch (error) {
      console.warn("Error al eliminar archivos de boletas:", error.message);
    }

    // 5. Eliminar perfil de user_profiles
    const { error: perfilError } = await supabaseAdmin
      .from("user_profiles")
      .delete()
      .eq("id", userId);

    if (perfilError) {
      throw new Error(`Error al eliminar perfil: ${perfilError.message}`);
    }

    console.log("Perfil eliminado de la base de datos");

    // 6. Eliminar usuario de auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      console.warn("Error al eliminar usuario de auth:", authError.message);
      // No fallar si el perfil ya se eliminó pero el auth falla
    } else {
      console.log("Usuario eliminado del sistema de autenticación");
    }

    console.log(
      `Eliminación completa del usuario ${userId} finalizada exitosamente`
    );
    return true;
  } catch (error) {
    console.error("Error en eliminarUsuarioCompleto:", error);
    throw error;
  }
};
