/**
 * Servicio de validaciones para quiz
 */

/**
 * Valida la estructura de un quiz
 */
export const validarQuiz = (preguntas) => {
  const errors = [];
  const preguntasSinRespuestaCorrecta = [];

  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    errors.push("Debe haber al menos una pregunta");
    return errors;
  }

  if (preguntas.length > 10) {
    errors.push("Máximo 10 preguntas permitidas");
  }

  preguntas.forEach((pregunta, index) => {
    const preguntaNum = index + 1;

    // Validar pregunta
    if (!pregunta.pregunta || pregunta.pregunta.trim() === "") {
      errors.push(`La pregunta ${preguntaNum} no puede estar vacía`);
    }

    // Obtener opciones independientemente de la estructura (quiz_opciones vs opciones)
    const opciones = pregunta.quiz_opciones || pregunta.opciones || [];

    // Validar opciones
    if (!Array.isArray(opciones) || opciones.length !== 3) {
      errors.push(
        `La pregunta ${preguntaNum} debe tener exactamente 3 opciones`
      );
      return;
    }

    // Validar que todas las opciones tengan texto
    opciones.forEach((opcion, opcionIndex) => {
      const textoOpcion = opcion.texto || opcion.opcion || "";
      if (!textoOpcion || textoOpcion.trim() === "") {
        errors.push(
          `La opción ${
            opcionIndex + 1
          } de la pregunta ${preguntaNum} no puede estar vacía`
        );
      }
    });

    // Validar que haya exactamente una respuesta correcta
    const correctas = opciones.filter((opcion) => opcion.es_correcta);
    if (correctas.length !== 1) {
      preguntasSinRespuestaCorrecta.push(preguntaNum);
    }
  });

  // Agregar error de respuestas correctas de forma agrupada
  if (preguntasSinRespuestaCorrecta.length > 0) {
    if (preguntasSinRespuestaCorrecta.length === 1) {
      errors.push(
        `La pregunta <strong>${preguntasSinRespuestaCorrecta[0]}</strong> debe tener exactamente una respuesta correcta`
      );
    } else {
      const numerosPreguntas = preguntasSinRespuestaCorrecta.join(", ");
      errors.push(
        `Las preguntas <strong>${numerosPreguntas}</strong> deben tener exactamente una respuesta correcta`
      );
    }
  }

  return errors;
};

/**
 * Crea una pregunta vacía con estructura base
 */
export const crearPreguntaVacia = () => ({
  pregunta: "",
  opciones: [
    { texto: "", es_correcta: false },
    { texto: "", es_correcta: false },
    { texto: "", es_correcta: false },
  ],
});

/**
 * Valida una pregunta individual
 */
export const validarPregunta = (pregunta, numeroPregunta) => {
  const errors = [];

  if (!pregunta.pregunta || pregunta.pregunta.trim() === "") {
    errors.push(`La pregunta ${numeroPregunta} no puede estar vacía`);
  }

  if (pregunta.pregunta && pregunta.pregunta.length > 200) {
    errors.push(
      `La pregunta ${numeroPregunta} no puede tener más de 200 caracteres`
    );
  }

  // Obtener opciones independientemente de la estructura (quiz_opciones vs opciones)
  const opciones = pregunta.quiz_opciones || pregunta.opciones || [];

  if (!Array.isArray(opciones) || opciones.length !== 3) {
    errors.push(
      `La pregunta ${numeroPregunta} debe tener exactamente 3 opciones`
    );
    return errors;
  }

  // Validar opciones
  opciones.forEach((opcion, index) => {
    const textoOpcion = opcion.texto || opcion.opcion || "";
    if (!textoOpcion || textoOpcion.trim() === "") {
      errors.push(
        `La opción ${
          index + 1
        } de la pregunta ${numeroPregunta} no puede estar vacía`
      );
    }
    if (textoOpcion && textoOpcion.length > 100) {
      errors.push(
        `La opción ${
          index + 1
        } de la pregunta ${numeroPregunta} no puede tener más de 100 caracteres`
      );
    }
  });

  // Validar respuesta correcta
  const correctas = opciones.filter((opcion) => opcion.es_correcta);
  if (correctas.length !== 1) {
    errors.push(
      `La pregunta ${numeroPregunta} debe tener exactamente una respuesta correcta`
    );
  }

  return errors;
};
