/**
 * Textos editoriais das seções. Edite aqui sem tocar nos componentes.
 */
import { photos } from '../config/images'

export const hero = {
  eyebrow: 'Cozinha contemporânea',
  titleLines: ['Sabores que', 'merecem ser'],
  titleAccent: 'vividos.',
  description: 'Uma cozinha contemporânea que transforma ingredientes, encontros e pequenos momentos em grandes experiências.',
  primaryCta: 'Reservar mesa',
  secondaryCta: 'Ver cardápio',
  note: 'Almoço e jantar · terça a domingo',
  plateLabel: 'Prato da estação',
}

export const kitchen = {
  eyebrow: 'Nossa cozinha',
  title: 'Cozinhar é escolher com cuidado.',
  paragraphs: [
    'A SÉRIA nasceu de uma ideia simples: uma comida honesta, feita com técnica e servida sem pressa. O cardápio acompanha as estações e muda quando os ingredientes pedem.',
    'Trabalhamos com produtores próximos, fazemos pães e massas na casa e deixamos o fogo baixo fazer o resto. O resultado são pratos com personalidade, que convidam a dividir a mesa.',
  ],
  cta: 'Conhecer o cardápio',
  principles: [
    { title: 'Menu de estação', text: 'Pratos revistos a cada estação.' },
    { title: 'Produtores parceiros', text: 'Hortaliças, queijos e carnes de origem conhecida.' },
    { title: 'Feito na casa', text: 'Pães, massas frescas e fermentados próprios.' },
    { title: 'Carta enxuta', text: 'Vinhos de pequenos produtores, sempre em taça.' },
  ],
  quote: '“Ingrediente bom pede pouca interferência e muita atenção.”',
  quoteAuthor: 'Filosofia da cozinha',
}

export const experiences = {
  eyebrow: 'Experiências',
  title: 'Três maneiras de sentar à nossa mesa.',
  intro: 'Do almoço de meio de semana ao menu conduzido pelo chef, cada experiência tem seu próprio ritmo.',
  items: [
    {
      id: 'almoco',
      index: '01',
      name: 'Almoço contemporâneo',
      when: 'Terça a domingo, 12h às 15h',
      description: 'Menu executivo com entrada, principal e sobremesa do dia. Leve, rápido quando precisa ser, generoso sempre.',
      detail: 'A partir de R$ 89 por pessoa',
      photo: photos.expLunch,
    },
    {
      id: 'jantar',
      index: '02',
      name: 'Jantar especial',
      when: 'Terça a sábado, a partir das 19h',
      description: 'Salão à meia-luz, carta de vinhos em taça e pratos para compartilhar. A noite pede calma e boa conversa.',
      detail: 'Cardápio à la carte',
      photo: photos.expDinner,
    },
    {
      id: 'chef',
      index: '03',
      name: 'Menu do chef',
      when: 'Quinta a sábado, mediante reserva',
      description: 'Sete tempos criados a partir do que chegou de melhor na semana, servidos no balcão em frente à cozinha.',
      detail: 'R$ 289 por pessoa · harmonização opcional',
      photo: photos.expChef,
    },
  ],
}

export const differentials = {
  eyebrow: 'Por que a SÉRIA',
  title: 'Mais que uma refeição, um jeito de receber.',
  badgeLabel: 'Menu atual',
  badgeValue: 'Primavera',
  items: [
    {
      id: 'ingredientes',
      title: 'Ingredientes selecionados',
      text: 'Compramos de quem planta, cria e pesca com cuidado. O que chega fresco define o prato do dia.',
      photo: photos.diffIngredients,
    },
    {
      id: 'autorais',
      title: 'Criações autorais',
      text: 'Técnica clássica a serviço de combinações próprias, com sabor claro e apresentação cuidadosa.',
      photo: photos.diffSignature,
    },
    {
      id: 'ambiente',
      title: 'Ambiente acolhedor',
      text: 'Madeira, luz quente e um salão pensado para conversas longas. Elegante, nunca formal demais.',
      photo: photos.diffAmbience,
    },
    {
      id: 'momentos',
      title: 'Momentos especiais',
      text: 'Aniversários, pedidos, reencontros. Ajudamos a preparar a mesa para o que você quer celebrar.',
      photo: photos.diffMoments,
    },
  ],
}

export const marqueeWords = ['Fogo baixo', 'Massa fresca', 'Ingrediente de estação', 'Vinho em taça', 'Mesa sem pressa', 'Feito na casa']

export const events = {
  eyebrow: 'Eventos e ocasiões',
  title: 'Planejando uma noite que merece ser lembrada?',
  description:
    'Recebemos jantares comemorativos e pequenos grupos no salão reservado, com menu ajustado à ocasião e atendimento dedicado.',
  occasions: [
    { title: 'Jantares comemorativos', text: 'Aniversários, conquistas e datas que pedem brinde.' },
    { title: 'Encontros especiais', text: 'Pedidos, reencontros e noites a dois com mesa preparada.' },
    { title: 'Pequenos eventos', text: 'Salão reservado para até 24 convidados.' },
    { title: 'Experiências personalizadas', text: 'Menu desenhado com o chef e harmonização sob medida.' },
  ],
  cta: 'Planejar uma ocasião especial',
  occasionTypes: ['Jantar comemorativo', 'Encontro especial', 'Pequeno evento', 'Experiência personalizada', 'Outro'],
}

export const testimonials = {
  eyebrow: 'Depoimentos',
  title: 'O que fica depois da mesa.',
  disclaimer: 'Depoimentos fictícios, criados para demonstração do layout.',
  items: [
    {
      quote: 'O risoto de cogumelos tinha aquele sabor de cozinha de casa, só que mais preciso. Saímos planejando a próxima visita.',
      name: 'Marina A.',
      context: 'Jantar a dois',
    },
    {
      quote: 'Comemoramos o aniversário da minha mãe no salão reservado. A equipe cuidou de tudo sem a gente precisar pedir.',
      name: 'Rafael T.',
      context: 'Jantar comemorativo',
    },
    {
      quote: 'O menu do chef é uma pequena viagem. Sete pratos, nenhum excesso, e o balcão em frente à cozinha faz toda a diferença.',
      name: 'Helena C.',
      context: 'Menu do chef',
    },
    {
      quote: 'Virou nosso almoço de sexta. Rápido quando a gente precisa, e a sobremesa do dia sempre surpreende.',
      name: 'Lucas e Bia',
      context: 'Almoço contemporâneo',
    },
  ],
}

export const reservations = {
  eyebrow: 'Reservas',
  title: 'Reserve sua mesa.',
  description: 'Escolha o dia, o horário e quantas pessoas vêm com você. Confirmamos por telefone.',
  demoNotice: 'Demonstração: nenhuma reserva real é criada e nenhum dado é enviado ou armazenado.',
}

export const gallery = {
  eyebrow: 'Galeria',
  title: 'Da cozinha para a mesa.',
}

export const location = {
  eyebrow: 'Visite',
  title: 'Onde estamos e quando abrimos.',
}
