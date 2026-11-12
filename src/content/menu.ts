/**
 * Cardápio demonstrativo. Preços em reais (centavos para evitar erros de arredondamento).
 * Para um cliente real, edite apenas este arquivo.
 */

export type DietTag = 'vegetariano' | 'vegano' | 'sem-gluten' | 'sem-lactose' | 'contem-nozes' | 'frutos-do-mar' | 'picante'

export const dietLabels: Record<DietTag, { short: string; long: string }> = {
  vegetariano: { short: 'Veg', long: 'Vegetariano' },
  vegano: { short: 'Vegano', long: 'Vegano' },
  'sem-gluten': { short: 'S/ glúten', long: 'Sem glúten' },
  'sem-lactose': { short: 'S/ lactose', long: 'Sem lactose' },
  'contem-nozes': { short: 'Nozes', long: 'Contém oleaginosas' },
  'frutos-do-mar': { short: 'Mar', long: 'Contém frutos do mar' },
  picante: { short: 'Picante', long: 'Levemente picante' },
}

export type MenuCategoryId = 'entradas' | 'principais' | 'massas' | 'sobremesas' | 'bebidas'

export type Dish = {
  id: string
  name: string
  description: string
  ingredients: string[]
  price: number
  category: MenuCategoryId
  tags: DietTag[]
  photo?: string
  photoAlt?: string
  signature?: boolean
}

export const menuCategories: { id: MenuCategoryId; label: string; intro: string }[] = [
  { id: 'entradas', label: 'Entradas', intro: 'Para abrir a mesa e dividir sem cerimônia.' },
  { id: 'principais', label: 'Pratos principais', intro: 'Peixes do dia, carnes de produtores parceiros e fogo baixo.' },
  { id: 'massas', label: 'Massas e risotos', intro: 'Massas frescas feitas na casa todas as manhãs.' },
  { id: 'sobremesas', label: 'Sobremesas', intro: 'Doçura medida, frutas da estação e chocolate de origem.' },
  { id: 'bebidas', label: 'Bebidas', intro: 'Coquetéis autorais, vinhos em taça e café especial.' },
]

export const dishes: Dish[] = [
  // ENTRADAS
  {
    id: 'burrata-tomates',
    name: 'Burrata, tomates assados e pesto de folhas',
    description: 'Burrata cremosa sobre tomates confitados lentamente, finalizada com pesto de rúcula e azeite de oliva extravirgem.',
    ingredients: ['Burrata', 'Tomates italianos', 'Rúcula', 'Castanha-do-pará', 'Azeite extravirgem', 'Flor de sal'],
    price: 6800,
    category: 'entradas',
    tags: ['vegetariano', 'contem-nozes'],
    photo: 'photo-1653565922895-4c08e12ea9f5',
    photoAlt: 'Burrata servida com fio de azeite e ervas em prato branco',
    signature: true,
  },
  {
    id: 'pao-fermentacao',
    name: 'Pão de fermentação natural e manteiga de ervas',
    description: 'Pão da casa com casca crocante, servido morno com manteiga batida, ervas do jardim e azeitonas curadas.',
    ingredients: ['Farinha de trigo', 'Levain', 'Manteiga', 'Tomilho', 'Azeitonas'],
    price: 3200,
    category: 'entradas',
    tags: ['vegetariano'],
    photo: 'photo-1582536446725-5ad9e6ef0535',
    photoAlt: 'Fatia de pão rústico ao lado de azeite e azeitonas',
  },
  {
    id: 'ceviche-peixe',
    name: 'Ceviche de peixe branco com leite de tigre',
    description: 'Peixe do dia curado no limão, cebola roxa, coentro e um toque de pimenta dedo-de-moça.',
    ingredients: ['Peixe branco do dia', 'Limão', 'Cebola roxa', 'Coentro', 'Pimenta dedo-de-moça', 'Milho tostado'],
    price: 6200,
    category: 'entradas',
    tags: ['sem-gluten', 'sem-lactose', 'frutos-do-mar', 'picante'],
    photo: 'photo-1731570225640-7ddad4231679',
    photoAlt: 'Ceviche servido em tigela escura com ervas',
    signature: true,
  },
  {
    id: 'camaroes-alho',
    name: 'Camarões no alho negro e limão-siciliano',
    description: 'Camarões salteados na manteiga noisette com alho negro, raspas de limão-siciliano e salsa crespa.',
    ingredients: ['Camarões', 'Alho negro', 'Manteiga', 'Limão-siciliano', 'Salsa'],
    price: 7400,
    category: 'entradas',
    tags: ['sem-gluten', 'frutos-do-mar'],
    photo: 'photo-1626663011519-b42e5ee10056',
    photoAlt: 'Camarões servidos em prato raso com ervas',
  },

  // PRINCIPAIS
  {
    id: 'salmao-brasa',
    name: 'Salmão na brasa, legumes tostados e beurre blanc',
    description: 'Salmão de pele crocante, legumes da estação tostados na chapa e molho beurre blanc com cebolinha.',
    ingredients: ['Salmão', 'Abobrinha', 'Aspargos', 'Manteiga', 'Vinho branco', 'Cebolinha'],
    price: 11800,
    category: 'principais',
    tags: ['sem-gluten', 'frutos-do-mar'],
    photo: 'photo-1519708227418-c8fd9a32b7a2',
    photoAlt: 'Salmão grelhado com legumes em prato escuro',
    signature: true,
  },
  {
    id: 'peixe-dia',
    name: 'Peixe do dia, purê de mandioquinha e manteiga de limão',
    description: 'Filé selado na manteiga, purê sedoso de mandioquinha e emulsão cítrica de limão-cravo.',
    ingredients: ['Peixe do dia', 'Mandioquinha', 'Limão-cravo', 'Manteiga', 'Brotos'],
    price: 10400,
    category: 'principais',
    tags: ['sem-gluten', 'frutos-do-mar'],
    photo: 'photo-1580476262798-bddd9f4b7369',
    photoAlt: 'Filé de peixe grelhado sobre purê em prato branco',
  },
  {
    id: 'polvo-batatas',
    name: 'Polvo grelhado, batatas ao murro e páprica defumada',
    description: 'Polvo cozido lentamente e finalizado na grelha, batatas crocantes, aioli de páprica e ervas.',
    ingredients: ['Polvo', 'Batatas', 'Páprica defumada', 'Alho', 'Azeite', 'Salsa'],
    price: 13600,
    category: 'principais',
    tags: ['sem-gluten', 'sem-lactose', 'frutos-do-mar'],
    photo: 'photo-1578935149228-66b184c83e69',
    photoAlt: 'Polvo grelhado servido em prato azul com legumes',
  },
  {
    id: 'sardinhas-brasa',
    name: 'Sardinhas na brasa e salada de funcho',
    description: 'Sardinhas frescas grelhadas inteiras, salada crocante de funcho, laranja e azeitonas.',
    ingredients: ['Sardinhas', 'Funcho', 'Laranja', 'Azeitonas', 'Azeite'],
    price: 8600,
    category: 'principais',
    tags: ['sem-gluten', 'sem-lactose', 'frutos-do-mar'],
    photo: 'photo-1600699899970-b1c9fadd8f9e',
    photoAlt: 'Sardinhas grelhadas dispostas lado a lado',
  },
  {
    id: 'salmao-ervas',
    name: 'Posta de salmão em crosta de ervas',
    description: 'Posta alta assada com crosta de ervas frescas e alecrim, servida com arroz de limão.',
    ingredients: ['Salmão', 'Alecrim', 'Tomilho', 'Arroz', 'Limão'],
    price: 11200,
    category: 'principais',
    tags: ['sem-lactose', 'frutos-do-mar'],
    photo: 'photo-1641898378716-1f38ec04bb0f',
    photoAlt: 'Posta de salmão grelhada com alecrim',
  },

  // MASSAS E RISOTOS
  {
    id: 'risoto-cogumelos',
    name: 'Risoto de cogumelos e parmesão envelhecido',
    description: 'Arroz carnaroli cozido no caldo de cogumelos tostados, finalizado com manteiga e parmesão de 24 meses.',
    ingredients: ['Arroz carnaroli', 'Cogumelos frescos', 'Parmesão', 'Manteiga', 'Vinho branco', 'Tomilho'],
    price: 8900,
    category: 'massas',
    tags: ['vegetariano', 'sem-gluten'],
    photo: 'photo-1779805903328-d64e57f3f8b4',
    photoAlt: 'Risoto cremoso servido em prato fundo branco',
    signature: true,
  },
  {
    id: 'risoto-limao',
    name: 'Risoto de limão-siciliano e aspargos',
    description: 'Risoto leve e cítrico, aspargos frescos e raspas de limão, com um fio de azeite verde.',
    ingredients: ['Arroz carnaroli', 'Limão-siciliano', 'Aspargos', 'Parmesão', 'Azeite'],
    price: 8400,
    category: 'massas',
    tags: ['vegetariano', 'sem-gluten'],
    photo: 'photo-1682428617976-f25633ed8469',
    photoAlt: 'Risoto claro com ervas em prato branco',
  },
  {
    id: 'pappardelle-ragu',
    name: 'Pappardelle ao ragu de costela',
    description: 'Massa fresca larga, ragu de costela cozido por oito horas e queijo pecorino ralado na hora.',
    ingredients: ['Massa fresca de ovos', 'Costela bovina', 'Tomate', 'Vinho tinto', 'Pecorino'],
    price: 9200,
    category: 'massas',
    tags: [],
    photo: 'photo-1473093226795-af9932fe5856',
    photoAlt: 'Pappardelle com molho e folhas de manjericão',
  },
  {
    id: 'tagliolini-manteiga',
    name: 'Tagliolini na manteiga de sálvia',
    description: 'Fios finos de massa fresca, manteiga noisette com sálvia crocante e parmesão.',
    ingredients: ['Massa fresca', 'Manteiga', 'Sálvia', 'Parmesão', 'Pimenta-do-reino'],
    price: 7600,
    category: 'massas',
    tags: ['vegetariano'],
    photo: 'photo-1597692493647-25bd4240a3f2',
    photoAlt: 'Massa enrolada em tigela escura vista de cima',
  },
  {
    id: 'nhoque-tostado',
    name: 'Nhoque tostado, abóbora e amêndoas',
    description: 'Nhoque de batata dourado na frigideira, creme de abóbora assada e amêndoas tostadas.',
    ingredients: ['Batata', 'Farinha', 'Abóbora cabotiá', 'Amêndoas', 'Sálvia'],
    price: 7900,
    category: 'massas',
    tags: ['vegetariano', 'contem-nozes'],
    photo: 'photo-1788603378122-1c3708b1a26a',
    photoAlt: 'Nhoques dourados com molho em prato raso',
  },

  // SOBREMESAS
  {
    id: 'bolo-chocolate',
    name: 'Bolo úmido de chocolate 70%',
    description: 'Camadas de bolo de chocolate de origem, ganache sedosa e uma pitada de flor de sal.',
    ingredients: ['Chocolate 70%', 'Ovos', 'Manteiga', 'Açúcar mascavo', 'Flor de sal'],
    price: 3800,
    category: 'sobremesas',
    tags: ['vegetariano'],
    photo: 'photo-1709195902163-7eee13e78970',
    photoAlt: 'Fatia de bolo de chocolate com cobertura brilhante',
    signature: true,
  },
  {
    id: 'mousse-chocolate',
    name: 'Mousse de chocolate e azeite',
    description: 'Mousse aerada de chocolate amargo, azeite frutado e crocante de cacau.',
    ingredients: ['Chocolate amargo', 'Azeite', 'Nibs de cacau', 'Ovos'],
    price: 3400,
    category: 'sobremesas',
    tags: ['vegetariano', 'sem-gluten'],
    photo: 'photo-1590080875852-ba44f83ff2db',
    photoAlt: 'Mousse de chocolate em tigela com colher de madeira',
  },
  {
    id: 'creme-frutas',
    name: 'Creme de baunilha e frutas vermelhas',
    description: 'Creme leve de baunilha do cerrado, frutas vermelhas maceradas e farofa amanteigada.',
    ingredients: ['Baunilha', 'Creme de leite', 'Frutas vermelhas', 'Farofa de amêndoas'],
    price: 3600,
    category: 'sobremesas',
    tags: ['vegetariano', 'contem-nozes'],
    photo: 'photo-1698688334089-c68105801d02',
    photoAlt: 'Sobremesa cremosa servida em taça',
  },
  {
    id: 'sorbet-estacao',
    name: 'Sorbet de fruta da estação',
    description: 'Sorbet feito na casa com a fruta da semana. Pergunte ao salão o sabor do dia.',
    ingredients: ['Fruta da estação', 'Açúcar demerara', 'Limão'],
    price: 2600,
    category: 'sobremesas',
    tags: ['vegano', 'sem-gluten', 'sem-lactose'],
  },

  // BEBIDAS
  {
    id: 'spritz-casa',
    name: 'Spritz da casa',
    description: 'Aperitivo cítrico, espumante seco, água com gás e laranja-bahia.',
    ingredients: ['Aperitivo cítrico', 'Espumante', 'Água com gás', 'Laranja'],
    price: 4200,
    category: 'bebidas',
    tags: ['vegano', 'sem-gluten'],
    photo: 'photo-1763132638674-673e0ae020d6',
    photoAlt: 'Coquetel alaranjado em taça sobre fundo laranja',
    signature: true,
  },
  {
    id: 'vinho-taca',
    name: 'Vinho tinto em taça',
    description: 'Seleção semanal de rótulos de pequenos produtores. Peça a sugestão do sommelier.',
    ingredients: ['Seleção do sommelier'],
    price: 3900,
    category: 'bebidas',
    tags: ['vegano', 'sem-gluten'],
    photo: 'photo-1553361371-9b22f78e8b1d',
    photoAlt: 'Taça de vinho tinto sobre a mesa',
  },
  {
    id: 'coquetel-sem-alcool',
    name: 'Coquetel sem álcool de hibisco',
    description: 'Hibisco, gengibre fresco, limão e água tônica artesanal.',
    ingredients: ['Hibisco', 'Gengibre', 'Limão', 'Tônica'],
    price: 2800,
    category: 'bebidas',
    tags: ['vegano', 'sem-gluten'],
    photo: 'photo-1551024709-8f23befc6f87',
    photoAlt: 'Coquetéis coloridos alinhados no balcão do bar',
  },
  {
    id: 'espresso',
    name: 'Espresso de origem',
    description: 'Café especial de torra média, notas de chocolate e frutas amarelas.',
    ingredients: ['Café arábica'],
    price: 1200,
    category: 'bebidas',
    tags: ['vegano', 'sem-gluten'],
    photo: 'photo-1559496417-e7f25cb247f3',
    photoAlt: 'Xícara de espresso iluminada pela luz natural',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso de origem com leite vaporizado e espuma sedosa.',
    ingredients: ['Café arábica', 'Leite integral'],
    price: 1600,
    category: 'bebidas',
    tags: ['vegetariano', 'sem-gluten'],
    photo: 'photo-1502462041640-b3d7e50d0662',
    photoAlt: 'Cappuccino com arte no leite em xícara escura',
  },
]

export const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
