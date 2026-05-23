import type { Book, BookContext, BookStatusMeta } from '@/components/books/types';

export const BOOK_STATUS_META: Record<Book['status'], BookStatusMeta> = {
  want_to_read: {
    label: 'Quero ler',
    badgeVariant: 'outline',
  },
  reading: {
    label: 'Lendo',
    badgeVariant: 'secondary',
  },
  completed: {
    label: 'Lido',
    badgeVariant: 'default',
  },
};

export const MOCK_BOOKS: Book[] = [
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    status: 'reading',
    created_at: '2026-05-03T10:15:00.000Z',
    updated_at: '2026-05-20T09:30:00.000Z',
  },
  {
    id: 'make-it-stick',
    title: 'Make It Stick',
    author: 'Peter C. Brown',
    status: 'reading',
    created_at: '2026-05-10T13:20:00.000Z',
    updated_at: '2026-05-21T19:10:00.000Z',
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'completed',
    rating: 4.9,
    created_at: '2026-04-11T08:40:00.000Z',
    updated_at: '2026-05-12T18:25:00.000Z',
  },
  {
    id: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    status: 'completed',
    rating: 4.4,
    created_at: '2026-03-21T15:00:00.000Z',
    updated_at: '2026-04-26T11:00:00.000Z',
  },
  {
    id: 'how-to-take-smart-notes',
    title: 'How to Take Smart Notes',
    author: 'Sönke Ahrens',
    status: 'want_to_read',
    created_at: '2026-05-18T16:00:00.000Z',
    updated_at: '2026-05-18T16:00:00.000Z',
  },
  {
    id: 'a-swim-in-a-pond-in-the-rain',
    title: 'A Swim in a Pond in the Rain',
    author: 'George Saunders',
    status: 'want_to_read',
    created_at: '2026-05-22T12:00:00.000Z',
    updated_at: '2026-05-22T12:00:00.000Z',
  },
];

export const BOOKS_EMPTY_STATE = {
  books: {
    title: 'Sua biblioteca ainda esta vazia',
    description: 'Adicione o primeiro livro para transformar leitura em memoria organizada.',
  },
  reflections: {
    title: 'Nenhuma reflexao registrada',
    description:
      'Escreva poucas linhas ao fim de cada sessao. Pequenas notas sustentam grandes lembrancas.',
  },
  queue: {
    title: 'Sem fila de leitura',
    description: 'Guarde aqui os proximos livros que merecem sua atencao.',
  },
} as const;

export const BOOK_STATUS_OPTIONS = [
  {
    label: 'Quero ler',
    value: 'want_to_read',
  },
  {
    label: 'Lendo',
    value: 'reading',
  },
  {
    label: 'Lido',
    value: 'completed',
  },
] as const;

export const BOOK_CONTEXT_BY_ID: Record<string, BookContext> = {
  'deep-work': {
    overview:
      'Um livro sobre concentracao profunda como pratica deliberada, nao como talento espontaneo.',
    currentChapter: 'Capitulo 3 · Aprofundar rituais',
    resumeNote: 'Voce parou na parte sobre rituais de foco e eliminacao de distracoes.',
    reflections: [
      {
        id: 'deep-work-r1',
        label: 'Sessao de hoje',
        content:
          'Foco nao e apenas disciplina. O ambiente precisa colaborar, senao a energia vai embora antes do trabalho comecar.',
        createdAt: '2026-05-20T08:30:00.000Z',
      },
      {
        id: 'deep-work-r2',
        label: 'Capitulo 2',
        content:
          'O livro fica mais convincente quando comparo minhas manhas interrompidas com os blocos curtos de silencio que realmente funcionaram.',
        createdAt: '2026-05-18T20:10:00.000Z',
      },
    ],
    highlights: [
      {
        id: 'deep-work-h1',
        label: 'Trecho marcado',
        excerpt: 'Clareza sobre o que importa torna a distração mais visível.',
        note: 'Boa frase para lembrar antes de abrir mensagens logo cedo.',
        createdAt: '2026-05-17T11:00:00.000Z',
      },
      {
        id: 'deep-work-h2',
        label: 'Trecho marcado',
        excerpt: 'Profundidade precisa de rito, não de improviso.',
        createdAt: '2026-05-16T09:45:00.000Z',
      },
    ],
    summaries: [
      {
        id: 'deep-work-s1',
        label: 'Resumo parcial',
        content:
          'A leitura mostra que trabalho profundo depende menos de inspiração e mais de condições estáveis: tempo protegido, menos troca de contexto e alguma repetição de ritual.',
        createdAt: '2026-05-15T18:20:00.000Z',
      },
    ],
  },
  'make-it-stick': {
    overview:
      'Um guia sobre aprendizagem duradoura baseada em evocacao, espacamento e esforco util.',
    currentChapter: 'Capitulo 2 · Recuperar antes de reler',
    resumeNote: 'Ultima parada no argumento sobre evocacao ativa como forma de consolidar memoria.',
    reflections: [
      {
        id: 'make-it-stick-r1',
        label: 'Leitura da noite',
        content:
          'O desconforto de tentar lembrar sozinho e sinal de trabalho real. Preciso aceitar esse atrito como parte do aprendizado.',
        createdAt: '2026-05-21T21:15:00.000Z',
      },
    ],
    highlights: [
      {
        id: 'make-it-stick-h1',
        label: 'Trecho marcado',
        excerpt:
          'Aprender bem parece mais difícil do que reler, porque realmente exige recuperação.',
        createdAt: '2026-05-19T19:30:00.000Z',
      },
    ],
    summaries: [
      {
        id: 'make-it-stick-s1',
        label: 'Resumo parcial',
        content:
          'Memoria melhora quando o leitor se testa, alterna assuntos e retorna ao material depois de algum espaco. Facilidade imediata engana.',
        createdAt: '2026-05-18T22:00:00.000Z',
      },
    ],
  },
  'atomic-habits': {
    overview: 'Mudancas pequenas e repetidas como base para identidade, ambiente e consistencia.',
    currentChapter: 'Leitura concluida',
    resumeNote: 'Livro lido com varias notas sobre ambiente e repeticao.',
    reflections: [
      {
        id: 'atomic-r1',
        label: 'Releitura de nota',
        content:
          'O ponto mais memoravel foi perceber que comportamento depende menos de motivacao do que eu imaginava.',
        createdAt: '2026-05-12T14:20:00.000Z',
      },
    ],
    highlights: [
      {
        id: 'atomic-h1',
        label: 'Trecho marcado',
        excerpt: 'Você não sobe ao nível das metas. Cai ao nível dos sistemas.',
        createdAt: '2026-05-10T10:00:00.000Z',
      },
    ],
    summaries: [
      {
        id: 'atomic-s1',
        label: 'Resumo final',
        content:
          'O livro reforça que identidade e ambiente moldam hábitos melhores do que intenções genéricas. Pequenos ajustes consistentes acumulam mais do que grandes promessas.',
        createdAt: '2026-05-09T18:40:00.000Z',
      },
    ],
  },
  'thinking-fast-and-slow': {
    overview:
      'Um mapa dos vieses, atalhos mentais e ilusoes de julgamento que aparecem no cotidiano.',
    currentChapter: 'Leitura concluida',
    resumeNote: 'Livro lido; notas mais fortes ficaram na parte de vieses e intuicao.',
    reflections: [
      {
        id: 'thinking-r1',
        label: 'Depois do capitulo 8',
        content:
          'Sem exemplos pessoais, os conceitos ficam elegantes demais. Aplicar em decisoes minhas tornou a leitura muito mais concreta.',
        createdAt: '2026-04-25T20:45:00.000Z',
      },
    ],
    highlights: [
      {
        id: 'thinking-h1',
        label: 'Trecho marcado',
        excerpt: 'O sistema rápido responde antes que a mente formule uma pergunta melhor.',
        createdAt: '2026-04-24T09:10:00.000Z',
      },
    ],
    summaries: [
      {
        id: 'thinking-s1',
        label: 'Resumo final',
        content:
          'A leitura mostra como julgamentos rápidos são úteis, mas frequentemente enviesados. O valor real está em reconhecer quando desacelerar.',
        createdAt: '2026-04-23T17:35:00.000Z',
      },
    ],
  },
  'how-to-take-smart-notes': {
    overview:
      'Um livro sobre transformar anotacoes em pensamento conectado, nao apenas em arquivo morto.',
    currentChapter: 'Ainda nao iniciado',
    resumeNote: 'Esperando entrada na fila para comecar com calma.',
    reflections: [],
    highlights: [],
    summaries: [],
  },
  'a-swim-in-a-pond-in-the-rain': {
    overview: 'Ensaios sobre leitura atenta, construcao de cena e sensibilidade ao texto.',
    currentChapter: 'Ainda nao iniciado',
    resumeNote: 'Separado para um momento de leitura mais lenta.',
    reflections: [],
    highlights: [],
    summaries: [],
  },
};
