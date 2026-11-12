/**
 * Configuração central do restaurante.
 * Tudo o que identifica o negócio (nome, contato, horários, redes, localização,
 * reservas) vive aqui. Os componentes apenas leem estes valores.
 */

export const site = {
  name: 'SÉRIA',
  tagline: 'Cozinha Contemporânea',
  description:
    'Uma cozinha contemporânea que transforma ingredientes, encontros e pequenos momentos em grandes experiências.',
  shortAbout: 'Cozinha de estação, mesa sem pressa e serviço atento. Um projeto demonstrativo Or7.dev.',

  /** Aviso exibido em pontos sensíveis: deixa claro que o site é uma demonstração */
  demoNotice: 'Restaurante fictício. Site demonstrativo desenvolvido pela Or7.dev.',

  nav: [
    { id: 'inicio', label: 'Início' },
    { id: 'cozinha', label: 'Nossa cozinha' },
    { id: 'cardapio', label: 'Cardápio' },
    { id: 'experiencias', label: 'Experiências' },
    { id: 'reservas', label: 'Reservas' },
  ],

  contact: {
    /** Telefone exibido. Valor demonstrativo (não é um número real). */
    phoneDisplay: '(11) 0000-0000',
    /** Para um cliente real, informe o telefone em formato internacional, ex.: '+5511999999999'. Vazio = sem link. */
    phoneHref: '' as string,
    email: 'contato@exemplo.com.br',
    /** Mostrar e-mail como link mailto: somente quando for real */
    emailIsReal: false,
  },

  /**
   * WhatsApp para envio do resumo de reserva.
   * Deixe vazio enquanto não houver número real: o botão não é exibido.
   * Formato: apenas dígitos com DDI, ex.: '5511999999999'.
   */
  whatsappNumber: '' as string,

  location: {
    isDemo: true,
    street: 'Rua Exemplo, 000',
    district: 'Bairro Demonstrativo',
    city: 'São Paulo — SP',
    reference: 'Endereço ilustrativo para apresentação',
    /** URL de incorporação do Google Maps (iframe src). Vazio = mapa ilustrativo. */
    mapEmbedUrl: '' as string,
    /** Link "Como chegar". Vazio = botão oculto. */
    directionsUrl: '' as string,
  },

  hours: [
    { days: 'Terça a sexta', lunch: '12h — 15h', dinner: '19h — 23h' },
    { days: 'Sábado', lunch: '12h — 16h', dinner: '19h — 00h' },
    { days: 'Domingo', lunch: '12h — 17h', dinner: null },
    { days: 'Segunda', lunch: null, dinner: null },
  ] as { days: string; lunch: string | null; dinner: string | null }[],

  socials: [
    { label: 'Instagram', handle: '@seria.cozinha', url: '' as string },
    { label: 'Facebook', handle: 'seria.cozinha', url: '' as string },
    { label: 'TikTok', handle: '@seria.cozinha', url: '' as string },
  ],

  reservation: {
    /** Horários oferecidos no formulário (demonstrativos) */
    lunchSlots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
    dinnerSlots: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
    minGuests: 1,
    maxGuests: 12,
    /** Dias da semana fechados (0 = domingo … 6 = sábado) */
    closedWeekdays: [1],
    /** Domingo: só almoço */
    lunchOnlyWeekdays: [0],
    /** Antecedência máxima em dias */
    maxDaysAhead: 90,
    largeGroupNote: 'Para grupos acima de 12 pessoas, use “Planejar uma ocasião especial”.',
  },

  credits: {
    label: 'Designed & Developed by Or7.dev',
    url: 'https://or7.dev',
  },
} as const

export type Site = typeof site
