# SÉRIA — Cozinha Contemporânea

Website demonstrativo de restaurante (Or7.dev · projeto 01.02). Restaurante, endereço, telefone e depoimentos são **fictícios**. Os formulários funcionam só como demonstração local: nada é enviado nem armazenado.

Direção visual inspirada na linguagem do template Sofra (hero escura com prato em destaque, navegação editorial, cardápio em abas com foto, faixa de galeria e wordmark monumental no rodapé), com identidade, textos, ilustrações e fotos próprios.

## Executar

Requisitos: Node 20+ (testado com Node 24).

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # TypeScript
npm run build        # build de produção em dist/
npm run preview      # serve o build
npm run test:e2e     # Playwright (desktop + mobile)
```

Os testes E2E usam o Google Chrome instalado (`channel: 'chrome'`). Se ele não estiver disponível, rode `npx playwright install chromium` e remova `channel` em `playwright.config.ts`.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion for React · Lucide · Fontsource (Fraunces e DM Sans auto-hospedadas) · Playwright.

## Estrutura

```
src/
  config/
    site.ts        nome, contato, horários, redes, localização, reservas, WhatsApp
    images.ts      registro central de fotos + helpers de URL/srcset
  content/
    menu.ts        cardápio (categorias, pratos, preços, marcadores alimentares)
    sections.ts    textos editoriais de todas as seções
  components/      Photo (fallback), Dialog (modal acessível), motion, FormField, Botanicals
  hooks/           seção ativa e estado de scroll
  lib/validation.ts  telefone BR, datas, sanitização
  sections/        Navbar, Hero, Kitchen, Experiences, Differentials, Menu, Marquee,
                   Events, Testimonials, Reservations, Gallery, Location, Footer
  index.css        tokens de cor, tipografia e escala fluida (@theme)
tests/site.spec.ts E2E dos fluxos principais
```

## Adaptar para um restaurante real

1. **Identidade:** cores e fontes no bloco `@theme` de `src/index.css`.
2. **Dados do negócio:** `src/config/site.ts`.
   - `whatsappNumber`: com um número real (só dígitos com DDI), o resumo da reserva ganha o botão "Enviar pelo WhatsApp". Vazio, o botão não aparece.
   - `location.mapEmbedUrl`: URL de incorporação do Google Maps. Vazio, aparece o mapa ilustrativo.
   - `location.directionsUrl`, `contact.phoneHref`, `socials[].url`: vazios, viram texto sem link.
   - `reservation`: horários, limites de pessoas, dias fechados e antecedência máxima.
   - Retire `demoNotice` e os avisos "demonstrativo" quando o conteúdo for real.
3. **Cardápio:** `src/content/menu.ts` (preços em centavos).
4. **Textos:** `src/content/sections.ts`.
5. **Fotos:** `src/config/images.ts` e o campo `photo` dos pratos. Aceita ID do Unsplash, URL absoluta ou caminho em `/public`.
6. **Reservas reais:** substitua o `setTimeout` de `confirm()` em `src/sections/Reservations.tsx` por uma chamada ao sistema de reservas do cliente.

## Fotografias

Todas as fotos vêm do [Unsplash](https://unsplash.com) (Unsplash License: uso comercial gratuito, sem atribuição obrigatória), servidas pela CDN `images.unsplash.com` com `srcset` responsivo e lazy loading. Nenhum asset do template de referência foi copiado. Ramos de alecrim, oliveira e manjericão são ilustrações SVG originais.

## Acessibilidade e motion

- Navegação por teclado em tudo: abas do cardápio com setas/Home/End, carrossel com setas, lightbox com setas e Escape.
- Modais com foco preso, Escape para fechar, fundo `inert` e foco devolvido ao gatilho.
- Formulários com labels persistentes, obrigatórios sinalizados, erros associados por `aria-describedby` e foco no primeiro campo inválido.
- `prefers-reduced-motion`: `MotionConfig reducedMotion="user"`, parallax e movimento ambiental desligados e marquee parado.
- Animações apenas com `transform`, `opacity` e `clip-path`, sem scroll hijacking.

## Limitações conhecidas

- Fotos dependem da CDN do Unsplash. Se uma falhar, aparece o fallback visual da marca. Para produção, o ideal é hospedar as imagens finais do cliente.
- O LCP da hero inclui a sequência de entrada (cerca de 2 s em desktop local e 4 s em mobile com CPU 4× e rede lenta). Se a prioridade for nota de LCP, encurte ou remova a revelação do título.
- Sem backend: reservas e eventos são simulados e nada é persistido.

## Publicação no GitHub Pages

Repositório: https://github.com/lorenzo-or7/restaurant-contemporaneo-demo

1. Envie os arquivos para a branch `main`.
2. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
3. Aguarde o workflow **Deploy GitHub Pages** concluir.
4. Acesse https://lorenzo-or7.github.io/restaurant-contemporaneo-demo/

O `base` do Vite já está configurado para o subcaminho desse repositório.
