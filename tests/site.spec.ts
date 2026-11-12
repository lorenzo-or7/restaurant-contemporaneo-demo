import { expect, test, type Page } from '@playwright/test'

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024

function isoDate(offsetDays: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Próxima data (a partir de +2 dias) que não seja segunda (fechado) nem domingo (só almoço). */
function nextDinnerDate() {
  for (let i = 2; i < 12; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    if (d.getDay() !== 1 && d.getDay() !== 0) return isoDate(i)
  }
  return isoDate(3)
}

function nextMondayDate() {
  for (let i = 1; i < 9; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    if (d.getDay() === 1) return isoDate(i)
  }
  return isoDate(7)
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('carrega sem erros de console e sem overflow horizontal', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabores que')
  const { scrollW, clientW } = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }))
  expect(scrollW).toBeLessThanOrEqual(clientW)
  expect(errors).toEqual([])
})

test('navegação por âncoras e menu mobile', async ({ page }) => {
  await page.goto('/')
  if (isMobile(page)) {
    const toggle = page.getByRole('button', { name: 'Abrir menu' })
    await toggle.click()
    const menu = page.getByRole('navigation', { name: 'Menu mobile' })
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await toggle.click()
    await menu.getByRole('link', { name: /Cardápio/ }).click()
    await expect(menu).toBeHidden()
  } else {
    await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Cardápio' }).click()
  }
  await expect(page).toHaveURL(/#cardapio$/)
  await expect(page.getByRole('tablist', { name: 'Categorias do cardápio' })).toBeInViewport()
})

test('cardápio: troca de categorias por clique e teclado', async ({ page }) => {
  await page.goto('/#cardapio')
  const tabs = page.getByRole('tablist', { name: 'Categorias do cardápio' })
  const panel = page.getByRole('tabpanel')
  await expect(tabs.getByRole('tab', { name: 'Entradas' })).toHaveAttribute('aria-selected', 'true')
  await expect(panel).toContainText('Burrata')

  await tabs.getByRole('tab', { name: 'Sobremesas' }).click()
  await expect(tabs.getByRole('tab', { name: 'Sobremesas' })).toHaveAttribute('aria-selected', 'true')
  await expect(panel).toContainText('Bolo úmido de chocolate')

  await page.keyboard.press('ArrowRight')
  await expect(tabs.getByRole('tab', { name: 'Bebidas' })).toBeFocused()
  await expect(panel).toContainText('Spritz da casa')

  for (const id of ['Entradas', 'Pratos principais', 'Massas e risotos', 'Sobremesas', 'Bebidas']) {
    await tabs.getByRole('tab', { name: id }).click()
    expect(await panel.getByRole('listitem').filter({ has: page.getByRole('button') }).count()).toBeGreaterThanOrEqual(4)
  }
})

test('cardápio: modal do prato abre, prende foco e fecha com Escape', async ({ page }) => {
  await page.goto('/#cardapio')
  const trigger = page.getByRole('button', { name: /Risoto de cogumelos/ })
  await page.getByRole('tab', { name: 'Massas e risotos' }).click()
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: /Risoto de cogumelos/ })
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Ingredientes')
  await expect(dialog).toContainText('Arroz carnaroli')
  await expect(dialog).toContainText('R$ 89,00')
  await expect(dialog).toContainText('Sem glúten')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('reservas: validação, bloqueio de datas passadas e fluxo de demonstração', async ({ page }) => {
  await page.goto('/#reservas')
  const form = page.locator('#reservas form')
  await form.getByRole('button', { name: 'Revisar reserva' }).click()
  await expect(form).toContainText('Informe seu nome')
  await expect(form).toContainText('Informe um telefone')
  await expect(form).toContainText('Escolha a data')
  await expect(page.locator('#rs-name')).toBeFocused()

  // data passada é recusada
  await expect(page.locator('#rs-date')).toHaveAttribute('min', isoDate(0))
  await page.locator('#rs-date').fill(isoDate(-2))
  await page.locator('#rs-name').fill('Ana Souza')
  await page.locator('#rs-phone').fill('1191234')
  await form.getByRole('button', { name: 'Revisar reserva' }).click()
  await expect(form).toContainText('data passada')
  await expect(form).toContainText('Telefone inválido')

  // segunda-feira: fechado
  await page.locator('#rs-date').fill(nextMondayDate())
  await expect(page.locator('#rs-time')).toBeDisabled()

  // caminho feliz
  await page.locator('#rs-phone').fill('11912345678')
  await expect(page.locator('#rs-phone')).toHaveValue('(11) 91234-5678')
  await page.locator('#rs-date').fill(nextDinnerDate())
  await page.locator('#rs-time').selectOption('20:00')
  await page.getByRole('button', { name: 'Aumentar número de pessoas' }).click()
  await expect(page.locator('#rs-guests')).toHaveValue('3')
  await page.locator('#rs-notes').fill('Aniversário <script>alert(1)</script>')
  await form.getByRole('button', { name: 'Revisar reserva' }).click()

  const section = page.locator('#reservas')
  await expect(section).toContainText('Confira os dados')
  await expect(section).toContainText('Ana Souza')
  await expect(section).toContainText('20:00')
  await expect(section).toContainText('3 pessoas')
  await expect(section).not.toContainText('<script>')

  await section.getByRole('button', { name: 'Editar dados' }).click()
  await expect(page.locator('#rs-name')).toHaveValue('Ana Souza')
  await form.getByRole('button', { name: 'Revisar reserva' }).click()
  await section.getByRole('button', { name: 'Enviar solicitação' }).click()
  await expect(section.getByRole('status')).toContainText('Solicitação demonstrativa registrada')
  await expect(section).toContainText('nenhuma reserva foi criada')
  // sem número de WhatsApp configurado, não há link para destino fictício
  await expect(section.getByRole('link', { name: /WhatsApp/ })).toHaveCount(0)
})

test('reservas: limite de pessoas', async ({ page }) => {
  await page.goto('/#reservas')
  await page.locator('#rs-guests').fill('40')
  await page.locator('#reservas form').getByRole('button', { name: 'Revisar reserva' }).click()
  await expect(page.locator('#reservas form')).toContainText('Informe de 1 a 12 pessoas')
})

test('eventos: formulário de interesse demonstrativo', async ({ page }) => {
  await page.goto('/#eventos')
  await page.getByRole('button', { name: 'Planejar uma ocasião especial' }).click()
  const dialog = page.getByRole('dialog', { name: 'Planejar uma ocasião especial' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Enviar solicitação' }).click()
  await expect(dialog).toContainText('Escolha o tipo de ocasião')
  await dialog.locator('#ev-name').fill('Carlos Lima')
  await dialog.locator('#ev-phone').fill('21987654321')
  await dialog.locator('#ev-type').selectOption('Jantar comemorativo')
  await dialog.locator('#ev-date').fill(isoDate(20))
  await dialog.locator('#ev-guests').fill('14')
  await dialog.getByRole('button', { name: 'Enviar solicitação' }).click()
  await expect(dialog.getByRole('status')).toContainText('Nenhum evento foi agendado')
  await dialog.getByRole('button', { name: 'Concluir' }).click()
  await expect(dialog).toBeHidden()
})

test('depoimentos: controles e indicador de posição', async ({ page }) => {
  await page.goto('/')
  const next = page.getByRole('button', { name: 'Próximo depoimento' })
  await next.scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Ir para o depoimento 1' })).toHaveAttribute('aria-current', 'true')
  await next.click()
  await expect(page.getByRole('button', { name: 'Ir para o depoimento 2' })).toHaveAttribute('aria-current', 'true')
  await page.getByRole('region', { name: 'Depoimentos demonstrativos' }).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('button', { name: 'Ir para o depoimento 1' })).toHaveAttribute('aria-current', 'true')
  await expect(page.getByText('Depoimentos fictícios')).toBeVisible()
})

test('galeria: lightbox com navegação e Escape', async ({ page }) => {
  await page.goto('/#galeria')
  await page.getByRole('button', { name: /Ampliar foto: Bolo de chocolate/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Galeria de fotos' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('01 / 08')
  await page.keyboard.press('ArrowRight')
  await expect(dialog).toContainText('02 / 08')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(dialog).toContainText('08 / 08')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('experiências: interação por toque/clique sem depender de hover', async ({ page }) => {
  await page.goto('/#experiencias')
  const btn = isMobile(page)
    ? page.locator('#experiencias ul').getByRole('button', { name: /Menu do chef/ })
    : page.getByRole('button', { name: 'Ver detalhes: Menu do chef' })
  await btn.click()
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#experiencias')).toContainText('Sete tempos')
})

test('todas as imagens têm texto alternativo e nenhuma falhou', async ({ page }) => {
  await page.goto('/')
  // percorre a página para disparar o carregamento preguiçoso
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(120)
  }
  await page.waitForLoadState('networkidle')
  const missingAlt = await page.locator('img:not([alt])').count()
  expect(missingAlt).toBe(0)
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src))
  expect(broken).toEqual([])
})
