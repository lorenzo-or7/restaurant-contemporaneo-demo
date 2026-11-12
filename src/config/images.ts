/**
 * Registro central de fotografias.
 * Todas as imagens atuais vêm do Unsplash (Unsplash License — uso comercial livre,
 * sem necessidade de atribuição). Para um cliente real, troque o `src` por
 * arquivos próprios em /public ou por outra CDN; o restante do site não muda.
 */

export type PhotoSource = {
  /** ID Unsplash (photo-...) ou URL absoluta / caminho local */
  src: string
  alt: string
  /** ponto focal para object-position (ex.: '50% 40%') */
  focus?: string
}

const UNSPLASH = 'https://images.unsplash.com/'

export function photoUrl(src: string, width: number, height?: number, quality = 72) {
  if (!src.startsWith('photo-')) return src
  const h = height ? `&h=${height}` : ''
  return `${UNSPLASH}${src}?auto=format&fit=crop&w=${width}${h}&q=${quality}`
}

export function photoSrcSet(src: string, widths: number[], ratio?: number) {
  if (!src.startsWith('photo-')) return undefined
  return widths.map((w) => `${photoUrl(src, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(', ')
}

export const photos = {
  heroPlate: { src: 'photo-1767065584562-0127cdec486d', alt: 'Prato fundo branco visto de cima, com caldo dourado, legumes e ervas frescas' },
  heroSide: { src: 'photo-1759277513204-b432a70af08f', alt: 'Prato autoral verde decorado com flores comestíveis' },

  kitchenMain: { src: 'photo-1577219492769-b63a779fac28', alt: 'Cozinheiro finalizando pratos sob luminárias quentes na cozinha aberta', focus: '50% 40%' },
  kitchenDetail: { src: 'photo-1572715376701-98568319fd0b', alt: 'Mãos finalizando um prato com pinça e folhas frescas' },

  expLunch: { src: 'photo-1669472546359-418a98630699', alt: 'Entrada leve servida em prato raso branco' },
  expDinner: { src: 'photo-1731481382640-4859340396a7', alt: 'Salão à meia-luz com velas e mesas postas para o jantar' },
  expChef: { src: 'photo-1775497950071-965cf9e20b2f', alt: 'Chef montando um prato delicado com ervas, em detalhe' },

  diffIngredients: { src: 'photo-1575023497656-1b8d04dc6f75', alt: 'Damascos frescos em tigela escura sobre mesa de pedra' },
  diffSignature: { src: 'photo-1580554530778-ca36943938b2', alt: 'Peito de pato fatiado com purê e folhas, em prato branco' },
  diffAmbience: { src: 'photo-1688437307687-fe226bddfab1', alt: 'Bar e salão com iluminação quente e madeira' },
  diffMoments: { src: 'photo-1463183547458-6a2c760d0912', alt: 'Mesa comprida posta para um jantar entre amigos' },

  eventsHero: { src: 'photo-1608306680588-ef9108144c76', alt: 'Mesa decorada com velas vermelhas e flores para uma comemoração' },
  reservation: { src: 'photo-1562050344-f7ad946cee35', alt: 'Salão do restaurante com mesas postas e luz natural' },
} satisfies Record<string, PhotoSource>

export const galleryPhotos: (PhotoSource & { caption: string; layout: 'tall' | 'wide' | 'square' })[] = [
  { src: 'photo-1641424795072-a108a63c4b1c', alt: 'Bolo de chocolate com morangos frescos', caption: 'Sobremesa da casa', layout: 'tall' },
  { src: 'photo-1690983320937-ca293f1d1d97', alt: 'Cortes de carne crua sobre tábua escura', caption: 'Cortes selecionados', layout: 'square' },
  { src: 'photo-1570598912132-0ba1dc952b7d', alt: 'Coquetéis cítricos com rodelas de laranja vistos de cima', caption: 'Bar da estação', layout: 'wide' },
  { src: 'photo-1731601816614-2423297fe97b', alt: 'Polvo grelhado servido sobre purê com ervas', caption: 'Polvo na brasa', layout: 'square' },
  { src: 'photo-1649825319037-f30ea5b611c7', alt: 'Salada colorida em tigela escura sobre a mesa', caption: 'Horta do dia', layout: 'tall' },
  { src: 'photo-1760445528912-60ff18771199', alt: 'Queijo assado com fio de azeite e uvas em travessa de cerâmica', caption: 'Para dividir', layout: 'wide' },
  { src: 'photo-1597131628347-c769fc631754', alt: 'Massa fresca com azeitonas pretas em prato branco', caption: 'Massa feita na casa', layout: 'square' },
  { src: 'photo-1547595628-c61a29f496f0', alt: 'Taça de vinho rosé servida no balcão do bar', caption: 'Carta de vinhos', layout: 'square' },
]
