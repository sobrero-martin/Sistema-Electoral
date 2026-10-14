import { CandidateList, VoterRecord, HeuristicRule } from '../types/election';

export const CANDIDATE_LISTS: CandidateList[] = [
  {
    id: 'list-501',
    listNumber: '501',
    partyName: 'Frente Cívico Municipal',
    sublema: 'Gestión y Progreso Ciudadano',
    colorHex: '#0284c7', // Sky Blue
    badgeBg: 'bg-sky-600',
    mayorCandidate: 'Ing. Martín Álvarez',
    mayorTitle: 'Candidato a Intendente Municipal',
    councilorLead: 'Dra. Silvina Gómez (1ra Concejal)',
    auditorLead: 'Lic. Mariano Bellocq (Trib. Cuentas)',
    photoUrl: '/src/assets/images/cand_martin_alvarez_1792007441765.jpg',
    proposals: [
      'Digitalización y simplificación total de trámites municipales',
      'Nuevo plan integral de pavimentación y luminarias LED barriales',
      'Creación del Polo Tecnológico y Capacitación Joven',
    ],
  },
  {
    id: 'list-502',
    listNumber: '502',
    partyName: 'Unión Vecinal Progresista',
    sublema: 'Transparencia y Participación',
    colorHex: '#0d9488', // Teal
    badgeBg: 'bg-teal-600',
    mayorCandidate: 'Lic. Lucía Herrera',
    mayorTitle: 'Candidata a Intendenta Municipal',
    councilorLead: 'Prof. Carlos Menéndez (1er Concejal)',
    auditorLead: 'Cont. Valeria Mansilla (Trib. Cuentas)',
    photoUrl: '/src/assets/images/cand_lucia_herrera_1792007442315.jpg',
    proposals: [
      'Presupuesto participativo en las 14 comunas municipales',
      'Modernización del sistema de salud y salas de atención primaria',
      'Corredores verdes y programa de reciclaje con economía circular',
    ],
  },
  {
    id: 'list-503',
    listNumber: '503',
    partyName: 'Alianza Republicana Federal',
    sublema: 'Orden, Austeridad y Futuro',
    colorHex: '#7c3aed', // Purple
    badgeBg: 'bg-violet-600',
    mayorCandidate: 'Dr. Roberto Rossi',
    mayorTitle: 'Candidato a Intendente Municipal',
    councilorLead: 'Dra. Claudia Vidal (1ra Concejal)',
    auditorLead: 'Dr. Fernando Larrea (Trib. Cuentas)',
    photoUrl: '/src/assets/images/cand_roberto_rossi_1792007443297.jpg',
    proposals: [
      'Baja del 25% en tasas comerciales y fomento a pymes locales',
      'Anillo de seguridad y centro de monitoreo inteligente 24/7',
      'Auditoría pública externa y reducción de gastos superfluos',
    ],
  },
  {
    id: 'list-504',
    listNumber: '504',
    partyName: 'Movimiento de Integración Ciudadana',
    sublema: 'Comunidad, Educación y Trabajo',
    colorHex: '#ea580c', // Orange
    badgeBg: 'bg-orange-600',
    mayorCandidate: 'Dra. Valentina Paz',
    mayorTitle: 'Candidata a Intendenta Municipal',
    councilorLead: 'Arq. Gonzalo Ortiz (1er Concejal)',
    auditorLead: 'Lic. Beatriz Quintana (Trib. Cuentas)',
    photoUrl: '/src/assets/images/cand_valentina_paz_1792007443543.jpg',
    proposals: [
      'Fortalecimiento de clubes barriales y centros de primera infancia',
      'Ampliación del boleto educativo municipal gratuito',
      'Red de agua potable y cloacas en barrios periféricos',
    ],
  },
];

export const INITIAL_VOTERS: VoterRecord[] = [
  {
    id: 'vot-1',
    dni: '38.412.901',
    lastName: 'ALONSO',
    firstName: 'Santiago Tomás',
    orderNumber: 1,
    exemplar: 'B',
    address: 'Av. San Martín 1420, Piso 3',
    status: 'voto_emitido',
    votedAt: '08:42 hs',
    stubCode: 'TRQ-001-A4',
  },
  {
    id: 'vot-2',
    dni: '42.190.552',
    lastName: 'BENÍTEZ',
    firstName: 'Camila Julieta',
    orderNumber: 2,
    exemplar: 'A',
    address: 'Calle Belgrano 388',
    status: 'voto_emitido',
    votedAt: '09:15 hs',
    stubCode: 'TRQ-002-B7',
  },
  {
    id: 'vot-3',
    dni: '29.881.043',
    lastName: 'CASTILLO',
    firstName: 'Fernando Gabriel',
    orderNumber: 3,
    exemplar: 'A',
    address: 'Pje. Sarmiento 45',
    status: 'voto_emitido',
    votedAt: '10:04 hs',
    stubCode: 'TRQ-003-C2',
  },
  {
    id: 'vot-4',
    dni: '34.762.109',
    lastName: 'DOMÍNGUEZ',
    firstName: 'Mariana Soledad',
    orderNumber: 4,
    exemplar: 'B',
    address: 'Av. Rivadavia 2110',
    status: 'pendiente',
  },
  {
    id: 'vot-5',
    dni: '18.329.410',
    lastName: 'ESPINOZA',
    firstName: 'Héctor Rodolfo',
    orderNumber: 5,
    exemplar: 'D',
    address: 'Calle Mitre 812',
    status: 'pendiente',
  },
  {
    id: 'vot-6',
    dni: '45.102.399',
    lastName: 'FERREYRA',
    firstName: 'Lucía Micaela',
    orderNumber: 6,
    exemplar: 'A',
    address: 'Calle España 192',
    status: 'pendiente',
  },
  {
    id: 'vot-7',
    dni: '24.912.871',
    lastName: 'GUTIÉRREZ',
    firstName: 'Alberto Daniel',
    orderNumber: 7,
    exemplar: 'C',
    address: 'Bv. Pellegrini 550',
    status: 'observado',
    votedAt: '11:20 hs',
    stubCode: 'TRQ-007-OBS',
  },
  {
    id: 'vot-8',
    dni: '39.801.442',
    lastName: 'HEREDIA',
    firstName: 'Florencia Inés',
    orderNumber: 8,
    exemplar: 'A',
    address: 'Calle Moreno 405',
    status: 'pendiente',
  },
  {
    id: 'vot-9',
    dni: '31.455.990',
    lastName: 'IBÁÑEZ',
    firstName: 'Maximiliano Ariel',
    orderNumber: 9,
    exemplar: 'B',
    address: 'Calle Urquiza 722',
    status: 'pendiente',
  },
  {
    id: 'vot-10',
    dni: '43.208.115',
    lastName: 'JUÁREZ',
    firstName: 'Melina Ayelén',
    orderNumber: 10,
    exemplar: 'A',
    address: 'Av. Las Heras 930',
    status: 'pendiente',
  },
];

export const NIELSEN_HEURISTICS: HeuristicRule[] = [
  {
    number: 1,
    name: 'Visibilidad del estado del sistema',
    principleDescription:
      'El sistema debe mantener siempre informados a los usuarios de lo que está ocurriendo, mediante una retroalimentación adecuada y en un tiempo razonable.',
    complianceSummary:
      'En la cabina de votación se presenta una barra de pasos secuencial ("Modo > Intendente > Concejales > Confirmación > Impresión"). En la mesa electoral, el indicador muestra con claridad si la mesa está ABIERTA o en ESCRUTINIO. Candidatos y Tribunal visualizan porcentaje de mesas escrutadas y transmisión criptográfica en tiempo real.',
    profileAnalysis: {
      votantes:
        'Saben exactamente en qué etapa del sufragio están y reciben confirmación física y visual de que su voto ha sido impreso correctamente.',
      candidatos:
        'Visualizan el estado de cada mesa (abierta, en recuento, escrutada o impugnada) con trazabilidad minuto a minuto.',
      trabajadores:
        'Tienen permanente registro de cantidad de electores que votaron, boletas habilitadas y avance de los comicios.',
      tribunal:
        'Monitorean la afluencia electoral global, porcentaje de mesas transmitidas e integridad de la red de votación.',
    },
    argentineLaw:
      'Ley 19.945 (Código Electoral Nacional), Art. 85 y 105: Obligación de mantener visible el estado de apertura y cierre de mesas y la libre fiscalización ciudadana.',
    interfaceFigures: [
      {
        figId: 'Fig. 1.1',
        title: 'Barra de Progreso y Estado de Sufragio en Cabina BUE',
        description: 'Muestra el paso activo (Selección / Confirmación / Impresión) con feedback inmediato en pantalla.',
        moduleKey: 'votante',
      },
      {
        figId: 'Fig. 1.2',
        title: 'Panel de Estado de Mesa de la Autoridad Electoral',
        description: 'Indicadores en tiempo real de electores presentes, votos emitidos y estado legal del comicio.',
        moduleKey: 'autoridad',
      },
      {
        figId: 'Fig. 1.3',
        title: 'Monitor de Transmisión de Actas en Tiempo Real',
        description: 'Porcentaje de mesas recibidas, validadas y telegramas digitalizados para el Tribunal.',
        moduleKey: 'tribunal',
      },
    ],
  },
  {
    number: 2,
    name: 'Coincidencia entre el sistema y el mundo real',
    principleDescription:
      'El sistema debe hablar el lenguaje de los usuarios, con palabras, frases y conceptos familiares para el usuario, en lugar de términos orientados al sistema.',
    complianceSummary:
      'La terminología empleada reproduce con exactitud los conceptos cívicos argentinos: "Cuarto Oscuro Digital", "Boleta Única Electrónica (BUE)", "Padrón", "Troquel", "Presidente de Mesa", "Fiscal Partidario", "Telegrama de Escrutinio", "Urna", "Voto en Blanco", "Voto Recurrido" e "Impugnado".',
    profileAnalysis: {
      votantes:
        'No tienen que descifrar tecnicismos informáticos; las opciones replican la boleta de papel tradicional con colores partidarios y número de lista.',
      candidatos:
        'Encuentran las agrupaciones políticas y alianzas con los números de lista oficiales otorgados por la Junta Electoral.',
      trabajadores:
        'Operan con el formato exacto del Padrón Nacional, troquel de constancia y actas oficiales de la Cámara Nacional Electoral.',
      tribunal:
        'Los reportes siguen el esquema legal de acta de apertura, telegrama provisorio y cómputo definitivo estipulado por la Justicia Electoral.',
    },
    argentineLaw:
      'Ley 19.945, Arts. 62, 86, 92: Regulación de la denominación de boletas, número de orden, ejemplares de DNI y formalidades de las actas comiciales.',
    interfaceFigures: [
      {
        figId: 'Fig. 2.1',
        title: 'Padrón con Verificación de Ejemplar de DNI y Troquel',
        description: 'Reproduce visualmente la libreta cívica/tarjeta y el troquel con código de barras.',
        moduleKey: 'autoridad',
      },
      {
        figId: 'Fig. 2.2',
        title: 'Diseño de Boleta Oficial con Colores y Símbolos',
        description: 'Fiel réplica de las boletas tradicionales argentinas con número de lista prominente.',
        moduleKey: 'votante',
      },
    ],
  },
  {
    number: 3,
    name: 'Control y libertad del usuario',
    principleDescription:
      'Los usuarios a menudo eligen funciones del sistema por error y necesitan una "salida de emergencia" claramente marcada para dejar el estado no deseado sin tener que pasar por un diálogo extendido.',
    complianceSummary:
      'El votante dispone en todo momento de botones prominentes "Modificar selección / Deshacer" y "Volver al inicio" antes de la impresión física. Si se equivoca de candidato, puede cambiarlo con un solo toque. La autoridad de mesa puede cancelar o reintentar la búsqueda en el padrón.',
    profileAnalysis: {
      votantes:
        'PRIORIDAD MÁXIMA: Para el votante, la capacidad de deshacer un error es crítica. La pantalla de confirmación permite volver a editar la selección de Intendente o Concejales de forma independiente.',
      candidatos:
        'Posibilidad de subsanar reclamos y consultar actas previas sin bloqueos en el sistema.',
      trabajadores:
        'Posibilidad de corregir un ingreso erróneo de cantidad de boletas durante el escrutinio antes de emitir el acta definitiva.',
      tribunal:
        'Facultad de revisar votos recurridos observados en mesa antes de incorporarlos al cómputo final.',
    },
    argentineLaw:
      'Ley 19.945 Art. 94 y Acordadas BUE: El voto no se considera emitido hasta que el elector confirma e introduce la boleta en la urna; libertad absoluta de corrección en pantalla.',
    interfaceFigures: [
      {
        figId: 'Fig. 3.1',
        title: 'Pantalla de Confirmación con Salida de Emergencia "Modificar Selección"',
        description: 'Permite al elector cambiar su voto de intendente o concejal antes de que se grabe o imprima.',
        moduleKey: 'votante',
      },
      {
        figId: 'Fig. 3.2',
        title: 'Edición y Corrección en Escrutinio Provisorio',
        description: 'La autoridad de mesa puede corregir valores ingresados antes del cierre y transmisión.',
        moduleKey: 'autoridad',
      },
    ],
  },
  {
    number: 4,
    name: 'Consistencia y estándares',
    principleDescription:
      'Los usuarios no deberían tener que preguntarse si diferentes palabras, situaciones o acciones significan lo mismo. Se deben seguir las convenciones de la plataforma.',
    complianceSummary:
      'Diseño institucional homogéneo en todos los módulos: tipografía legible, paleta oficial inspirada en los colores cívicos argentinos, ubicación fija de botones de acción principal (verde/azul a la derecha) y salida/cancelación (neutro a la izquierda). El voto en blanco mantiene la misma estructura en todas las categorías.',
    profileAnalysis: {
      votantes:
        'Todas las tarjetas de candidatos tienen la misma disposición: foto a la izquierda, número de lista arriba, nombre del candidato y concejales.',
      candidatos:
        'Mismas métricas y porcentajes mostrados con criterio D’Hondt y mayoría simple estandarizada.',
      trabajadores:
        'El flujo de trabajo replica estrictamente la secuencia que la CNE capacita en los manuales de autoridad de mesa.',
      tribunal:
        'Estandarización de códigos de mesa, circuitos y algoritmos de suma hash SHA-256.',
    },
    argentineLaw:
      'Acordada Extraordinaria CNE N° 42/2019 y Manual de Autoridades de Mesa del Ministerio del Interior.',
    interfaceFigures: [
      {
        figId: 'Fig. 4.1',
        title: 'Estandarización de Tarjetas de Candidatos',
        description: 'Estructura idéntica en dimensiones, tipografía y jerarquía visual en toda la cabina.',
        moduleKey: 'votante',
      },
    ],
  },
  {
    number: 5,
    name: 'Prevención de errores',
    principleDescription:
      'Aún mejor que los buenos mensajes de error es un diseño cuidadoso que evita que ocurra un problema en primer lugar.',
    complianceSummary:
      'Validaciones matemáticas automáticas en el escrutinio de mesa: el sistema impide ingresar más votos que sobres existentes en la urna. En la cabina de votación, se exige una confirmación visual explícita antes de imprimir el chip y papel. Verificación cruzada entre el chip RFID/QR y la pantalla de control.',
    profileAnalysis: {
      votantes:
        'Se evitan votos involuntarios gracias al paso obligatorio de confirmación visual y aviso si no seleccionó concejales.',
      candidatos:
        'Eliminación de errores de transcripción humana en las actas de escrutinio gracias al cómputo digital auditado.',
      trabajadores:
        'PRIORIDAD MÁXIMA: El sistema bloquea sumas inconsistentes (votos válidos + blancos + nulos ≠ total de votantes) previniendo actas fallidas.',
      tribunal:
        'PRIORIDAD MÁXIMA: Detección preventiva de adulteraciones mediante sellado criptográfico y hash digital.',
    },
    argentineLaw:
      'Ley 19.945 Art. 101 y 102: Prohibición de actas con tachaduras o discordancias aritméticas; el sistema previene la inconsistencia en origen.',
    interfaceFigures: [
      {
        figId: 'Fig. 5.1',
        title: 'Validador Aritmético de Escrutinio en Tiempo Real',
        description: 'Impide continuar si la suma de votos no coincide exactamente con el número de sobres registrados.',
        moduleKey: 'autoridad',
      },
      {
        figId: 'Fig. 5.2',
        title: 'Confirmación Gráfica Pre-Impresión de Boleta Única',
        description: 'El votante revisa su boleta con fotos reales antes de la grabación definitiva en el chip.',
        moduleKey: 'votante',
      },
    ],
  },
  {
    number: 6,
    name: 'Reconocimiento antes que recuerdo',
    principleDescription:
      'Minimizar la carga de memoria del usuario haciendo que los elementos, las acciones y las opciones sean visibles. El usuario no debería tener que recordar información.',
    complianceSummary:
      'En la pantalla de votación, todos los candidatos se presentan con su fotografía oficial, el escudo o isotipo partidario, el número de lista en gran tamaño y el nombre completo. No se requiere memorizar códigos ni números.',
    profileAnalysis: {
      votantes:
        'Reconocen instantáneamente a su candidato por la foto y el color característico del partido político sin memorias intermedias.',
      candidatos:
        'Garantía de que su imagen pública e identidad gráfica estén fielmente representadas en la pantalla.',
      trabajadores:
        'En el padrón no memorizan el estado del elector; el sistema muestra iconos y etiquetas textuales claras ("Emitió voto", "Pendiente").',
      tribunal:
        'Los listados de escuelas muestran circuito, dirección y estado sin necesidad de buscar en manuales externos.',
    },
    argentineLaw:
      'Ley 26.571 (Ley de Democratización y Representación Política) y Acordada CNE sobre inclusión obligatoria de fotografías a color.',
    interfaceFigures: [
      {
        figId: 'Fig. 6.1',
        title: 'Grilla de Candidatos con Fotografía Oficial a Color y Colores Partidarios',
        description: 'Favorece el reconocimiento directo visual de figuras públicas y partidos.',
        moduleKey: 'votante',
      },
    ],
  },
  {
    number: 7,
    name: 'Flexibilidad y eficiencia de uso',
    principleDescription:
      'Los aceleradores (no vistos por los usuarios novatos) a menudo pueden acelerar la interacción para el usuario experto de tal manera que el sistema puede atender tanto a usuarios novatos como experimentados.',
    complianceSummary:
      'Doble modalidad de votación: "Votar Lista Completa" (para el 75% de electores que buscan rapidez y votar a todos los cargos del mismo partido con 1 solo toque) vs. "Votar por Categoría" (para el elector que desea cortar boleta). En la mesa, el presidente dispone de búsqueda instantánea por DNI o filtro por letra de apellido.',
    profileAnalysis: {
      votantes:
        'El voto de Lista Completa se completa en menos de 25 segundos, descongestionando las colas en los establecimientos escolares.',
      candidatos:
        'Permite a los fiscales filtrar rápidamente mesas de su circuito clave y exportar datos en un clic.',
      trabajadores:
        'PRIORIDAD MÁXIMA: Aceleradores como lector de DNI y teclado numérico aceleran el flujo continuo en la mesa.',
      tribunal:
        'Filtros multidimensionales por circuito electoral, escuela y estado de mesa.',
    },
    argentineLaw:
      'Constitución Nacional Art. 37 y Ley 19.945: Garantía de celeridad, universalidad e igualdad de condiciones en el sufragio.',
    interfaceFigures: [
      {
        figId: 'Fig. 7.1',
        title: 'Selector Inicial de Modalidad de Votación (Lista Completa vs Categorías)',
        description: 'Optimiza los tiempos de espera y agiliza el tránsito electoral en las escuelas.',
        moduleKey: 'votante',
      },
      {
        figId: 'Fig. 7.2',
        title: 'Buscador Predictivo de Electores en Padrón de Mesa',
        description: 'Filtro ultrarrápido por DNI o apellido con confirmación inmediata.',
        moduleKey: 'autoridad',
      },
    ],
  },
  {
    number: 8,
    name: 'Diseño estético y minimalista',
    principleDescription:
      'Los diálogos no deben contener información irrelevante o rara vez necesaria. Cada unidad adicional de información compite con las unidades relevantes y disminuye su visibilidad.',
    complianceSummary:
      'La cabina de votación presenta una interfaz totalmente desprovista de publicidad, animaciones innecesarias o distracciones. Botones táctiles amplios (mínimo 90px de altura para facilitar el toque a adultos mayores), tipografía limpia con alto contraste y sin "slop".',
    profileAnalysis: {
      votantes:
        'PRIORIDAD CLAVE: Cero sobrecarga cognitiva; sólo la información imprescindible para decidir el voto con serenidad y rapidez.',
      candidatos:
        'Tablas de resultados legibles con números tabulares alineados verticalmente.',
      trabajadores:
        'Pantallas despejadas con foco exclusivo en la tarea en curso (validar DNI o contar boletas).',
      tribunal:
        'Métricas concretas sin gráficos ornamentales superfluos.',
    },
    argentineLaw:
      'Ley 26.653 de Accesibilidad Web y Directrices de Diseño Universal en Sistemas Públicos del Estado Nacional Argentino.',
    interfaceFigures: [
      {
        figId: 'Fig. 8.1',
        title: 'Interfaz Despejada de Cabina con Blancos Generosos y Jerarquía Clara',
        description: 'Elimina cualquier elemento superfluo que pueda distraer o inducir a error al elector.',
        moduleKey: 'votante',
      },
    ],
  },
  {
    number: 9,
    name: 'Ayudar a los usuarios a reconocer, diagnosticar y recuperarse de errores',
    principleDescription:
      'Los mensajes de error deben expresarse en un lenguaje sencillo (sin códigos numéricos oscuros), indicar con precisión el problema y sugerir constructivamente una solución.',
    complianceSummary:
      'Los mensajes de alerta utilizan lenguaje empático y claro en español rioplatense institucional: "Atención: no ha seleccionado candidato a Concejales. Puede elegir ahora o confirmar Voto en Blanco". En el escrutinio: "La suma de votos supera por 1 al total de sobres. Por favor reingrese el conteo de la Lista 501".',
    profileAnalysis: {
      votantes:
        'Si tocan una opción equivocada, el sistema les explica qué se ha desmarcado y cómo rectificarlo de inmediato.',
      candidatos:
        'Si un telegrama presenta una objeción, el sistema describe textualmente la causal de reclamo.',
      trabajadores:
        'Los errores de carga aritmética se señalan con la diferencia exacta a corregir (+1 o -2 boletas).',
      tribunal:
        'Diagnósticos automáticos en telegramas observados con sugerencia de cotejo con el acta original.',
    },
    argentineLaw:
      'Ley 19.945 Art. 104: Procedimiento para la subsanación de discrepancias entre telegrama y certificado de escrutinio fiscal.',
    interfaceFigures: [
      {
        figId: 'Fig. 9.1',
        title: 'Diálogo Asistido de Omisión de Categoría con Sugerencia Constructiva',
        description: 'Advierte amablemente sobre categorías no seleccionadas antes del cierre.',
        moduleKey: 'votante',
      },
      {
        figId: 'Fig. 9.2',
        title: 'Asistente de Corrección Aritmética de Mesa Electoral',
        description: 'Indica qué columna presenta discordancia y cómo balancear el acta.',
        moduleKey: 'autoridad',
      },
    ],
  },
  {
    number: 10,
    name: 'Ayuda y documentación',
    principleDescription:
      'Aunque es mejor que el sistema se pueda usar sin documentación, puede ser necesario proporcionar ayuda. Esta información debe ser fácil de buscar y estar enfocada en la tarea del usuario.',
    complianceSummary:
      'Botón permanente de "Ayuda y Modo Asistido" en la cabina de votación con instrucciones visuales de cómo doblar y depositar la boleta en la urna. Para las autoridades de mesa, un manual digital interactivo integrado con las normas de la Cámara Nacional Electoral.',
    profileAnalysis: {
      votantes:
        'Guía rápida de 3 pasos accesibles desde la pantalla inicial y lector de voz para electores con disminución visual.',
      candidatos:
        'Guía de derechos y atribuciones de los fiscales de mesa según el Código Electoral.',
      trabajadores:
        'Manual de procedimiento paso a paso para apertura, resolución de controversias y cierre de escrutinio.',
      tribunal:
        'Protocolo de custodia de urnas, transmisión satelital/4G y trazabilidad de precintos.',
    },
    argentineLaw:
      'Ley 19.945 Art. 56 y Ley 26.653: Obligatoriedad de brindar asistencia y accesibilidad integral a todas las personas en el acto comicial.',
    interfaceFigures: [
      {
        figId: 'Fig. 10.1',
        title: 'Guía Rápida para el Elector en Pantalla de Cabina',
        description: 'Pasos ilustrados para votar, verificar el chip RFID y depositar el voto en la urna.',
        moduleKey: 'votante',
      },
      {
        figId: 'Fig. 10.2',
        title: 'Manual de Procedimientos Electorales para Autoridad de Mesa',
        description: 'Asistencia contextual y normativa en cada fase del comicio.',
        moduleKey: 'autoridad',
      },
    ],
  },
];
