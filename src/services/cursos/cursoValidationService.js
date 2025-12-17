/**
 * Servicio de validaciones para cursos
 */

/**
 * Valida el archivo de miniatura
 */
export const validarMiniatura = (file) => {
  const errors = [];

  // Validar tamaño (máximo 100KB)
  if (file.size > 100 * 1024) {
    errors.push("La miniatura no puede pesar más de 100KB");
  }

  // Validar tipo de archivo
  if (!file.type.startsWith("image/")) {
    errors.push("El archivo debe ser una imagen");
  }

  // Validar formato
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.push("Solo se permiten archivos JPG, PNG o WebP");
  }

  return errors;
};

/**
 * Valida las dimensiones de la imagen
 */
export const validarDimensionesImagen = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const errors = [];
      if (img.width > 500 || img.height > 500) {
        errors.push("La resolución máxima permitida es 500x500 píxeles");
      }
      resolve(errors);
    };
    img.onerror = () => {
      resolve(["Error al cargar la imagen"]);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Valida URL de YouTube
 */
export const validarUrlYoutube = (url) => {
  if (!url || url.trim() === "") {
    return "La URL de YouTube es requerida";
  }

  if (url.length > 200) {
    return "La URL de YouTube no puede tener más de 200 caracteres";
  }

  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}$/;

  if (!youtubeRegex.test(url)) {
    return "URL de YouTube no válida. Formatos permitidos: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID";
  }

  return null;
};

/**
 * Valida los datos del curso antes de crear/actualizar
 */
export const validarDatosCurso = (cursoData) => {
  const errors = [];

  if (!cursoData.titulo || cursoData.titulo.trim() === "") {
    errors.push("El título es requerido");
  }

  if (!cursoData.descripcion || cursoData.descripcion.trim() === "") {
    errors.push("La descripción es requerida");
  }

  if (cursoData.titulo && cursoData.titulo.length > 100) {
    errors.push("El título no puede tener más de 100 caracteres");
  }

  if (cursoData.descripcion && cursoData.descripcion.length > 500) {
    errors.push("La descripción no puede tener más de 500 caracteres");
  }

  const urlError = validarUrlYoutube(cursoData.video_youtube_url);
  if (urlError) {
    errors.push(urlError);
  }

  return errors;
};
