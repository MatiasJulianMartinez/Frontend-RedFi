// Flujo de conversación del asistente virtual de Red-Fi
export const flujoConversacion = {
  inicio: {
    mensaje:
      "Hola, soy el asistente virtual de Red-Fi. Estoy aquí para ayudarte a entender nuestra plataforma, elegir el mejor proveedor de Internet basándome en reseñas de usuarios, y resolver problemas técnicos comunes. ¿En qué puedo asistirte?",
    opciones: [
      { texto: "Información sobre Red-Fi", siguiente: "informacion" },
      { texto: "Ayuda técnica", siguiente: "ayuda_tecnica" },
      { texto: "Problemas de conexión", siguiente: "problemas_conexion" },
      { texto: "Herramientas disponibles", siguiente: "herramientas" },
      { texto: "Cuenta y perfil", siguiente: "cuenta" },
      { texto: "Proveedores y cobertura", siguiente: "proveedores" },
    ],
  },

  // === INFORMACIÓN SOBRE RED-FI ===
  informacion: {
    mensaje: "Te puedo contar todo sobre Red-Fi. ¿Qué te interesa saber?",
    opciones: [
      {
        texto: "¿Qué es Red-Fi?",
        respuesta:
          "Red-Fi es una plataforma comunitaria enfocada en la provincia de Corrientes que te ayuda a elegir el mejor proveedor de Internet para tu zona. Recopilamos reseñas reales de usuarios y las mostramos en un mapa interactivo para que puedas tomar decisiones informadas basándote en experiencias reales de otros usuarios de tu área específica.",
      },
      {
        texto: "¿Para quién es Red-Fi?",
        respuesta:
          "Red-Fi está diseñado para personas de Corrientes que buscan información confiable sobre proveedores de Internet: usuarios que quieren cambiar de proveedor basándose en opiniones reales de su zona, personas que se mudan dentro de la provincia y necesitan saber qué opciones tienen, o usuarios que quieren entender por qué tienen problemas de conectividad en su área.",
      },
      {
        texto: "¿Es gratuito usar Red-Fi?",
        respuesta:
          "Sí, Red-Fi tiene funciones gratuitas y un plan premium. Gratis puedes: consultar el mapa con reseñas, usar herramientas básicas como test de velocidad e información de red, y escribir reseñas. Con plan premium accedes a gestión de boletas, Academia Red-Fi y funciones sin anuncios.",
      },
      {
        texto: "¿Cómo funciona Red-Fi?",
        respuesta:
          "Red-Fi funciona así: 1) Los usuarios escriben reseñas honestas sobre sus proveedores, 2) Las reseñas se organizan por zonas geográficas en Corrientes, 3) Toda la información se muestra en un mapa interactivo, 4) Ofrecemos herramientas como test de velocidad y análisis de conexión para complementar la información.",
      },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },

  // === AYUDA TÉCNICA ===
  ayuda_tecnica: {
    mensaje: "¿Qué tipo de ayuda técnica necesitas?",
    opciones: [
      {
        texto: "Problemas con la plataforma",
        siguiente: "problemas_plataforma",
      },
      { texto: "Test de velocidad", siguiente: "test_velocidad" },
      { texto: "Uso del mapa", siguiente: "uso_mapa" },
      { texto: "Escribir reseñas", siguiente: "escribir_resenas" },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },

  problemas_plataforma: {
    mensaje: "¿Qué problema estás experimentando con Red-Fi?",
    opciones: [
      {
        texto: "La página no carga",
        respuesta:
          "Si Red-Fi no carga correctamente: 1) Verifica tu conexión a Internet, 2) Refresca la página (Ctrl+F5 o Cmd+Shift+R), 3) Prueba en modo incógnito, 4) Intenta con otro navegador. Si el problema persiste, podríamos estar realizando mantenimiento.",
      },
      {
        texto: "No puedo iniciar sesión",
        respuesta:
          "Para problemas de inicio de sesión: 1) Verifica que tu email y contraseña sean correctos, 2) Intenta desde otro navegador o dispositivo.",
      },
      {
        texto: "El mapa no se muestra",
        respuesta:
          "Si el mapa no aparece: 1) Permite el acceso a tu ubicación cuando el navegador lo solicite, 2) Refresca la página, 3) Prueba con otro navegador.",
      },
      { texto: "Volver a ayuda técnica", siguiente: "ayuda_tecnica" },
    ],
  },

  test_velocidad: {
    mensaje: "¿Necesitas ayuda con el test de velocidad?",
    opciones: [
      {
        texto: "¿Cómo hacer el test?",
        respuesta:
          "Para realizar un test de velocidad preciso:\n\n1) Ve a la sección 'Herramientas' y selecciona 'Test de Velocidad'\n2) Cierra aplicaciones que usen Internet (streaming, descargas, etc.)\n3) Si es posible, conéctate por cable Ethernet en lugar de WiFi\n4) Haz clic en 'Iniciar Test' y espera a que termine completamente\n5) Realiza varios tests en diferentes momentos para obtener un promedio real",
      },
      {
        texto: "¿Cómo interpretar resultados?",
        respuesta:
          "Interpretación de resultados: Descarga (Download) es la velocidad para recibir datos como ver videos o navegar. Subida (Upload) es la velocidad para enviar datos como videoconferencias o subir archivos. Ping o latencia es el tiempo de respuesta, importante para gaming. Si tus resultados son consistentemente menores al 70% de lo contratado, tienes motivos para reclamar a tu proveedor.",
      },
      {
        texto: "Resultados muy bajos",
        respuesta:
          "Si tu velocidad es muy baja:\n\n1) Reinicia tu router desconectándolo 30 segundos\n2) Conéctate por cable Ethernet directamente\n3) Si usas WiFi, acércate al router\n4) Cierra todos los dispositivos y aplicaciones que no estés usando\n5) Verifica que no haya descargas automáticas activas\n6) Si la velocidad sigue siendo menor al 50% de lo contratado, contacta a tu proveedor con evidencia de los tests",
      },
      { texto: "Volver a ayuda técnica", siguiente: "ayuda_tecnica" },
    ],
  },

  uso_mapa: {
    mensaje: "¿Qué necesitas saber sobre el mapa de cobertura?",
    opciones: [
      {
        texto: "¿Cómo agregar información?",
        respuesta:
          "Para contribuir con información al mapa:\n\n1) Ve a la sección 'Mapa' en Red-Fi\n2) Explora las zonas disponibles en Corrientes\n3) Busca tu proveedor o zona de interés\n4) Si tienes cuenta, puedes escribir una reseña seleccionando el proveedor correspondiente\n5) Califica tu experiencia y describe detalladamente tu experiencia para ayudar a otros usuarios de tu zona",
      },
      { texto: "Volver a ayuda técnica", siguiente: "ayuda_tecnica" },
    ],
  },

  escribir_resenas: {
    mensaje: "¿Necesitas ayuda para escribir reseñas?",
    opciones: [
      {
        texto: "¿Cómo escribir una reseña?",
        respuesta:
          "Para escribir una reseña útil:\n\n1) Crea una cuenta en Red-Fi si aún no tienes una\n2) Ve a la sección de reseñas o encuentra el proveedor en el mapa\n3) Selecciona 'Escribir reseña'\n4) Califica del 1 al 5 estrellas basándote en tu experiencia general\n5) Describe específicamente tu experiencia: velocidades reales vs prometidas, estabilidad, atención al cliente\n6) Menciona tu zona aproximada en Corrientes y el plan que tienes",
      },
      {
        texto: "¿Qué incluir en la reseña?",
        respuesta:
          "Incluye información valiosa como: Velocidad real que obtienes vs la contratada, estabilidad de la conexión a lo largo del día, calidad y tiempo de respuesta del servicio técnico, relación precio-calidad del plan, tiempo que tomó la instalación, problemas frecuentes si los hay, y si recomendarías o no el proveedor. Evita incluir datos personales y mantén un lenguaje respetuoso.",
      },
      {
        texto: "¿Puedo editar mi reseña?",
        respuesta:
          "Para gestionar tus reseñas: 1) Ve a 'Mi Cuenta' en el menú de usuario, 2) Selecciona 'Mis reseñas' para ver todas las reseñas que has escrito, 3) Desde allí puedes ver el estado de tus reseñas y la información que has proporcionado. Las reseñas actualizadas son muy valiosas para mantener la información precisa para otros usuarios.",
      },
      { texto: "Volver a ayuda técnica", siguiente: "ayuda_tecnica" },
    ],
  },

  // === PROBLEMAS DE CONEXIÓN ===
  problemas_conexion: {
    mensaje:
      "Te ayudo a diagnosticar y solucionar problemas de conectividad comunes. ¿Qué tipo de problema estás experimentando?",
    opciones: [
      { texto: "Internet muy lento", siguiente: "internet_lento" },
      { texto: "Sin conexión", siguiente: "sin_conexion" },
      { texto: "Problemas de WiFi", siguiente: "problemas_wifi" },
      { texto: "Cortes frecuentes", siguiente: "cortes_frecuentes" },
      { texto: "Problemas gaming/streaming", siguiente: "gaming_streaming" },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },

  internet_lento: {
    mensaje:
      "La lentitud de Internet puede tener varias causas. Te ayudo a identificar y solucionar el problema",
    opciones: [
      {
        texto: "Diagnóstico rápido",
        respuesta:
          "Pasos para diagnosticar lentitud:\n\n1) Realiza un test de velocidad en Red-Fi para medir tu velocidad real\n2) Reinicia el router desconectándolo 30 segundos\n3) Conéctate por cable Ethernet si es posible\n4) Cierra todas las aplicaciones y dispositivos que no estés usando\n5) Compara los resultados con lo que tienes contratado\n6) Verifica en nuestro mapa si otros usuarios en tu zona reportan problemas similares",
      },
      {
        texto: "Optimizar conexión WiFi",
        respuesta:
          "Para mejorar tu WiFi:\n\n1) Acércate físicamente al router\n2) Cambia a la banda de 5GHz si tu router la tiene disponible\n3) Evita interferencias alejando el router de microondas, teléfonos inalámbricos y otros routers\n4) Actualiza los controladores (drivers) de tu tarjeta WiFi\n5) Cambia el canal del router en la configuración\n6) Ubica el router en un lugar alto y central de tu hogar",
      },
      {
        texto: "Verificar plan contratado",
        respuesta:
          "Revisa si el problema es con tu plan: \n\n1) Compara la velocidad real del test con la velocidad contratada\n2) Si obtienes menos del 70% de lo contratado consistentemente, tienes motivos para reclamar\n3) Verifica si tu plan tiene límites de datos o restricciones horarias\n4) Pregunta a tu proveedor sobre mejoras de infraestructura en tu zona\n5) Consulta las reseñas en Red-Fi para ver si otros usuarios tienen mejor experiencia con otros proveedores en tu área.",
      },
      {
        texto: "Volver a problemas de conexión",
        siguiente: "problemas_conexion",
      },
    ],
  },

  sin_conexion: {
    mensaje:
      "Si estás completamente sin Internet, vamos paso a paso para identificar el problema:",
    opciones: [
      {
        texto: "Verificaciones básicas",
        respuesta:
          "Verificaciones esenciales cuando no tienes Internet:\n\n1) Revisa que todos los cables estén bien conectados\n2) Verifica las luces del router (deben estar verdes o azules, no rojas)\n3) Reinicia el router desconectándolo de la corriente por 30 segundos\n4) Prueba la conexión con diferentes dispositivos (teléfono, computadora)\n5) Verifica si el problema es solo tuyo o también afecta a tus vecinos",
      },
      {
        texto: "Problemas del proveedor",
        respuesta:
          "Si sospechas que el problema es de tu proveedor: \n\n1) Consulta la página web o redes sociales de tu proveedor para reportes de cortes\n2) Llama al número de soporte técnico que aparece en tu factura\n3) Pregunta a vecinos cercanos si tienen el mismo problema\n4) Revisa nuestro mapa de Red-Fi para ver reportes recientes en tu zona\n5) Considera usar datos móviles temporalmente mientras se resuelve el problema.",
      },
      {
        texto: "Router con fallas",
        respuesta:
          "Si el router puede estar fallando: \n\n1) Verifica que todas las luces del router estén en su estado normal (consulta el manual)\n2) Intenta un reset completo del router presionando el botón pequeño por 10 segundos\n3) Si es posible, actualiza el firmware del router\n4) Prueba conectar un dispositivo directamente al módem (saltándote el router)\n5) Si el router tiene varios años, podría necesitar reemplazo.",
      },
      {
        texto: "Volver a problemas de conexión",
        siguiente: "problemas_conexion",
      },
    ],
  },

  problemas_wifi: {
    mensaje:
      "Los problemas de WiFi son muy comunes. ¿Cuál es específicamente tu situación?",
    opciones: [
      {
        texto: "No aparece mi red WiFi",
        respuesta:
          "Si no encuentras tu red WiFi: \n\n1) Reinicia el router y espera 2-3 minutos\n2) Verifica que el WiFi esté activado en el router (busca un botón o switch físico)\n3) En tu dispositivo, actualiza la lista de redes disponibles\n4) Revisa si el nombre de red (SSID) está configurado como oculto\n5) Intenta acercarte mucho al router\n6) Verifica que tu dispositivo no esté en modo avión.",
      },
      {
        texto: "Señal muy débil",
        respuesta:
          "Para mejorar la señal WiFi: \n\n1) Coloca el router en un lugar alto y central de tu hogar\n2) Evita obstáculos como paredes gruesas, muebles metálicos o espejos\n3) Aleja el router de electrodomésticos que puedan causar interferencias\n4) Si tu casa es grande, considera comprar un repetidor WiFi o sistema mesh\n5) Actualiza el router si tiene más de 5 años, ya que la tecnología ha mejorado considerablemente.",
      },
      {
        texto: "Se desconecta constantemente",
        respuesta:
          "Si tu WiFi se desconecta frecuentemente: \n\n1) Elimina la red guardada en tu dispositivo y vuelve a conectarte ingresando la contraseña\n2) Actualiza los controladores de la tarjeta WiFi de tu dispositivo\n3) Intenta cambiar entre las bandas de 2.4GHz y 5GHz\n4) Revisa la configuración de ahorro de energía en tu dispositivo\n5) Reinicia la configuración de red de tu dispositivo\n6) El problema puede ser interferencia de otros routers cercanos.",
      },
      {
        texto: "Volver a problemas de conexión",
        siguiente: "problemas_conexion",
      },
    ],
  },

  cortes_frecuentes: {
    mensaje:
      "Los cortes de Internet interrumpen tu trabajo y entretenimiento. Te ayudo a identificar la causa:",
    opciones: [
      {
        texto: "Identificar la causa",
        respuesta:
          "Para identificar qué causa los cortes: \n\n1) Anota los horarios exactos y duración de los cortes durante una semana\n2) Observa si afecta solo el WiFi o también la conexión por cable\n3) Nota si los cortes coinciden con el uso de electrodomésticos como aire acondicionado o microondas\n4) Pregunta a vecinos si experimentan lo mismo\n5) Revisa las redes sociales de tu proveedor y nuestro mapa para reportes en tu zona.",
      },
      {
        texto: "Soluciones temporales",
        respuesta:
          "Mientras resuelves el problema principal: \n\n1) Mantén datos móviles disponibles como respaldo\n2) Si trabajas desde casa, considera un router 4G/5G de emergencia\n3) Descarga contenido importante cuando tengas conexión estable\n4) Identifica puntos de acceso WiFi públicos confiables cerca de tu ubicación\n5) Configura tu teléfono como punto de acceso para emergencias.",
      },
      {
        texto: "Contactar al proveedor",
        respuesta:
          "Al contactar a tu proveedor por cortes frecuentes: \n\n1) Presenta la documentación de fechas y horarios de los cortes\n2) Solicita compensación o descuento por el mal servicio\n3) Pregunta específicamente sobre planes de mejora de infraestructura en tu zona\n4) Si no resuelven el problema, considera cambiar de proveedor consultando las reseñas en Red-Fi\n5) Deja tu experiencia documentada en una reseña para ayudar a otros usuarios.",
      },
      {
        texto: "Volver a problemas de conexión",
        siguiente: "problemas_conexion",
      },
    ],
  },

  gaming_streaming: {
    mensaje:
      "Los problemas de gaming y streaming requieren soluciones específicas. ¿Cuál es tu situación?",
    opciones: [
      {
        texto: "Lag alto en videojuegos",
        respuesta:
          "Para reducir el lag en gaming: \n\n1) Siempre usa conexión por cable Ethernet en lugar de WiFi\n2) Cierra completamente todas las aplicaciones que consuman Internet\n3) Si tu router lo permite, configura QoS (Quality of Service) para priorizar tu dispositivo de gaming\n4) Selecciona servidores geográficamente cercanos en los juegos\n5) Verifica que tu ping sea menor a 50ms en el test de Red-Fi\n6) Considera cambiar a un plan con menor latencia si el problema persiste.",
      },
      {
        texto: "Streaming con interrupciones",
        respuesta:
          "Para mejorar el streaming (como Twitch o YouTube): \n\n1) Verifica que tengas suficiente velocidad de subida (al menos 5 Mbps para 1080p)\n2) Si tienes problemas, reduce temporalmente la calidad de transmisión\n3) Usa codificación por hardware si tu equipo lo permite\n4) Cierra todos los programas innecesarios que consuman ancho de banda\n5) Transmite por cable Ethernet, no WiFi\n6) Si planeas hacer streaming profesional, considera un plan con mayor velocidad de subida.",
      },
      {
        texto: "Videos se ven mal (Netflix, YouTube)",
        respuesta:
          "Para mejorar la calidad de video en streaming: \n\n1) Verifica que tengas al menos 25 Mbps de descarga para contenido 4K\n2) Reinicia la aplicación de streaming completamente\n3) Revisa la configuración de calidad en la aplicación (puede estar limitada)\n4) Prueba el mismo contenido en otro dispositivo para descartar problemas del equipo\n5) Limpia la caché de la aplicación\n6) Si el problema persiste con buena velocidad, contacta al servicio de streaming y a tu proveedor de Internet.",
      },
      {
        texto: "Volver a problemas de conexión",
        siguiente: "problemas_conexion",
      },
    ],
  },

  // === HERRAMIENTAS ===
  herramientas: {
    mensaje: "¿Qué herramienta de Red-Fi quieres conocer mejor?",
    opciones: [
      {
        texto: "Mapa interactivo",
        respuesta:
          "El mapa interactivo es nuestra herramienta principal. Te permite: Ver proveedores disponibles por zonas en Corrientes, leer y escribir reseñas de usuarios reales por área específica, consultar calificaciones y experiencias detalladas de otros usuarios, y descubrir qué proveedores funcionan mejor en cada zona de la provincia.",
      },
      {
        texto: "Test de velocidad",
        respuesta:
          "Nuestro test de velocidad te permite: Medir tus velocidades actuales de descarga, subida y latencia, verificar si obtienes lo que tienes contratado, y generar evidencia para reclamos a tu proveedor. Es una herramienta web simple que funciona desde cualquier dispositivo sin instalaciones.",
      },
      {
        texto: "Información de red",
        respuesta:
          "La herramienta de información de red te muestra: Tu dirección IP pública actual, tu ubicación aproximada según tu conexión, y detalles técnicos básicos de tu conexión. Es útil para conocer datos técnicos de tu conexión actual.",
      },
      {
        texto: "Análisis de conexión",
        respuesta:
          "El análisis de conexión simula un análisis Wi-Fi de tu hogar para identificar zonas con mejor o peor señal. Te ayuda a entender cómo optimizar la ubicación de tu router y mejorar la cobertura en diferentes áreas de tu casa.",
      },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },

  // === CUENTA Y PERFIL ===
  cuenta: {
    mensaje: "¿Qué necesitas ayuda con tu cuenta de Red-Fi?",
    opciones: [
      {
        texto: "Crear cuenta nueva",
        respuesta:
          "Para registrarte en Red-Fi:\n\n1) Haz clic en el botón 'Registrarse' en la página principal\n2) Completa el formulario con tu email, contraseña, nombre y proveedor actual (opcional)\n3) Envía el formulario - tu cuenta se crea inmediatamente\n4) Ahora puedes escribir reseñas, cambiar tu plan y acceder a todas las funciones disponibles según tu plan elegido",
      },
      {
        texto: "Problemas de acceso",
        respuesta:
          "Si no puedes acceder a tu cuenta: \n\n1) Verifica que estés usando el email y contraseña correctos\n2) Intenta desde otro navegador o dispositivo para descartar problemas del navegador\n3) Asegúrate de que las cookies estén habilitadas en tu navegador\n4) Si creaste la cuenta recientemente, intenta recordar exactamente los datos que usaste.",
      },
      {
        texto: "Actualizar perfil",
        respuesta:
          "Para mantener tu perfil actualizado: \n\n1) Ve a 'Mi Cuenta' desde el menú de usuario\n2) Selecciona 'Editar perfil' para cambiar tu información personal y foto\n3) Usa 'Cambiar contraseña' si necesitas actualizar tu contraseña\n4) En 'Gestionar plan' puedes cambiar entre plan básico y premium según tus necesidades.",
      },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },

  // === PROVEEDORES Y COBERTURA ===
  proveedores: {
    mensaje:
      "Te ayudo con información sobre proveedores y cobertura. ¿Qué necesitas saber?",
    opciones: [
      {
        texto: "¿Cómo elegir proveedor?",
        respuesta:
          "Para elegir el mejor proveedor usando Red-Fi:\n\n1) Consulta nuestro mapa de cobertura ingresando tu dirección específica\n2) Lee las reseñas de usuarios de tu zona, no solo el promedio general\n3) Compara velocidades reales reportadas versus las prometidas por cada proveedor\n4) Evalúa la calidad de atención al cliente según experiencias de otros usuarios\n5) Considera la estabilidad del servicio y frecuencia de cortes reportados\n6) Analiza la relación precio-calidad basándote en experiencias reales, no solo en precios publicitados",
      },
      {
        texto: "Interpretar reseñas",
        respuesta:
          "Cómo interpretar correctamente las reseñas: Presta atención a reseñas recientes (últimos 6 meses) ya que los servicios pueden cambiar, busca patrones en múltiples reseñas en lugar de casos aislados, considera reseñas de usuarios con situaciones similares a la tuya (trabajo remoto, streaming, gaming), lee tanto reseñas positivas como negativas para tener una visión completa, verifica que las reseñas sean específicas sobre velocidades y problemas técnicos, y recuerda que experiencias pueden variar incluso dentro de la misma zona.",
      },
      {
        texto: "Cambiar de proveedor",
        respuesta:
          "Proceso recomendado para cambiar de proveedor: \n\n1) Investiga a fondo las opciones usando Red-Fi, enfocándote en tu zona específica\n2) Verifica disponibilidad real en tu dirección exacta contactando directamente\n3) Lee reseñas detalladas de usuarios cercanos geográficamente\n4) Documenta los problemas con tu proveedor actual (velocidades, cortes, etc.)\n5) Programa la instalación del nuevo servicio ANTES de cancelar el actual\n6) Una vez que confirmes que el nuevo servicio funciona bien, procede a cancelar el anterior.",
      },
      {
        texto: "Reportar problemas",
        respuesta:
          "Cómo reportar problemas efectivamente: \n\n1) Documenta los problemas con tests de velocidad realizados en diferentes momentos\n2) Escribe una reseña detallada en Red-Fi especificando fechas, horarios y tipo de problemas\n3) Contacta primero el soporte técnico de tu proveedor con evidencia documentada\n4) Si no obtienes solución, considera presentar reclamo en organismos de defensa del consumidor\n5) Mantén tu reseña actualizada para que otros usuarios sepan el estado actual del servicio\n6) Considera cambiar de proveedor si los problemas persisten sin solución.",
      },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },
};

// Opciones comunes que aparecen en múltiples lugares
export const opcionesComunes = {
  volverInicio: { texto: "Volver al menú principal", siguiente: "inicio" },
  masAyuda: { texto: "Necesito más ayuda", siguiente: "contacto_humano" },
  otroProblema: { texto: "Tengo otro problema", siguiente: "inicio" },
};

// Información de contacto y soporte adicional
export const contactoSoporte = {
  contacto_humano: {
    mensaje:
      "Red-Fi es un proyecto estudiantil desarrollado con fines educativos. Para consultas adicionales:",
    opciones: [
      {
        texto: "Sobre el proyecto",
        respuesta:
          "Red-Fi es un proyecto académico desarrollado por estudiantes para demostrar habilidades en desarrollo web y servicio a la comunidad. Está enfocado específicamente en la provincia de Corrientes para ayudar a los usuarios a tomar mejores decisiones sobre sus proveedores de Internet basándose en experiencias reales.",
      },
      {
        texto: "Reportar problema técnico",
        respuesta:
          "Si encuentras problemas técnicos con la plataforma: anota exactamente qué estabas haciendo cuando ocurrió el problema, indica qué navegador y versión estás usando, menciona si el problema se repite consistentemente, e incluye capturas de pantalla si es posible. Esta información ayuda a mejorar el proyecto.",
      },
      {
        texto: "Sugerir mejoras",
        respuesta:
          "Las sugerencias son muy valiosas para mejorar Red-Fi. Si tienes ideas, especialmente sobre: nuevas funcionalidades para el mapa, mejoras en el sistema de reseñas, herramientas adicionales útiles, o mejoras en la experiencia de usuario, estas contribuyen al desarrollo continuo del proyecto.",
      },
      { texto: "Volver al menú principal", siguiente: "inicio" },
    ],
  },
};

// Combinar todos los flujos
export const flujoCompleto = {
  ...flujoConversacion,
  ...contactoSoporte,
};
