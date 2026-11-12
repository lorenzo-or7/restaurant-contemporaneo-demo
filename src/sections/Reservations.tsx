import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Info, Loader2, MessageCircle, Minus, Plus, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { photos } from '../config/images'
import { site } from '../config/site'
import { reservations } from '../content/sections'
import { Photo } from '../components/Photo'
import { FormField, describedBy } from '../components/FormField'
import { EASE, ImageReveal, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'
import {
  addDaysISO,
  formatDateLong,
  isValidName,
  isValidPhone,
  maskPhone,
  parseISODate,
  sanitizeText,
  todayISO,
} from '../lib/validation'

type Data = { name: string; phone: string; date: string; time: string; guests: number; notes: string }
type Errors = Partial<Record<keyof Data, string>>
const cfg = site.reservation
const initial: Data = { name: '', phone: '', date: '', time: '', guests: 2, notes: '' }

/** Horários disponíveis para a data, respeitando dias fechados, só-almoço e horários já passados hoje. */
function slotsFor(date: string): { lunch: string[]; dinner: string[]; closed: boolean } {
  const d = parseISODate(date)
  if (!d) return { lunch: [], dinner: [], closed: false }
  const wd = d.getDay()
  if ((cfg.closedWeekdays as readonly number[]).includes(wd)) return { lunch: [], dinner: [], closed: true }
  let lunch: string[] = [...cfg.lunchSlots]
  let dinner: string[] = (cfg.lunchOnlyWeekdays as readonly number[]).includes(wd) ? [] : [...cfg.dinnerSlots]
  if (date === todayISO()) {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes() + 60 // 1h de antecedência
    const ok = (s: string) => {
      const [h, m] = s.split(':').map(Number)
      return h * 60 + m >= minutes
    }
    lunch = lunch.filter(ok)
    dinner = dinner.filter(ok)
  }
  return { lunch, dinner, closed: false }
}

function validate(d: Data): Errors {
  const e: Errors = {}
  if (!isValidName(d.name)) e.name = 'Informe seu nome (mínimo de 3 letras).'
  if (!d.phone) e.phone = 'Informe um telefone para contato.'
  else if (!isValidPhone(d.phone)) e.phone = 'Telefone inválido. Use DDD + número, ex.: (11) 91234-5678.'
  if (!d.date) e.date = 'Escolha a data da reserva.'
  else if (d.date < todayISO()) e.date = 'Não é possível reservar em uma data passada.'
  else if (d.date > addDaysISO(cfg.maxDaysAhead)) e.date = `Reservas abertas para os próximos ${cfg.maxDaysAhead} dias.`
  else if (slotsFor(d.date).closed) e.date = 'Estamos fechados neste dia da semana. Escolha outra data.'
  if (!d.time) e.time = d.date ? 'Escolha um horário.' : 'Escolha primeiro a data.'
  else if (d.date && ![...slotsFor(d.date).lunch, ...slotsFor(d.date).dinner].includes(d.time)) e.time = 'Horário indisponível para a data escolhida.'
  if (!Number.isInteger(d.guests) || d.guests < cfg.minGuests || d.guests > cfg.maxGuests)
    e.guests = `Informe de ${cfg.minGuests} a ${cfg.maxGuests} pessoas.`
  return e
}

export function Reservations() {
  const [data, setData] = useState<Data>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState<'form' | 'review' | 'done'>('form')
  const [loading, setLoading] = useState(false)
  const reduce = useReducedMotion()
  const stepRef = useRef<HTMLDivElement>(null)
  const prevStep = useRef(step)

  const slots = useMemo(() => slotsFor(data.date), [data.date])

  // move o foco para a nova etapa somente quando a etapa muda de fato
  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    stepRef.current?.focus({ preventScroll: true })
    stepRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }, [step, reduce])

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => {
      const next = { ...d, [k]: v }
      // ao trocar a data, descarta horário que deixou de existir
      if (k === 'date' && d.time) {
        const s = slotsFor(v as string)
        if (![...s.lunch, ...s.dinner].includes(d.time)) next.time = ''
      }
      return next
    })
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const clean: Data = { ...data, name: sanitizeText(data.name, 80), notes: sanitizeText(data.notes, 300) }
    const e = validate(clean)
    setErrors(e)
    const first = (Object.keys(e) as (keyof Data)[])[0]
    if (first) {
      document.getElementById(`rs-${first}`)?.focus()
      return
    }
    setData(clean)
    setStep('review')
  }

  const confirm = () => {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setStep('done')
    }, reduce ? 200 : 1100)
  }

  const reset = () => {
    setData(initial)
    setErrors({})
    setStep('form')
  }

  const whatsappHref = site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá! Gostaria de solicitar uma reserva no ${site.name}.\nNome: ${data.name}\nData: ${formatDateLong(data.date)}\nHorário: ${data.time}\nPessoas: ${data.guests}${data.notes ? `\nObservações: ${data.notes}` : ''}`,
      )}`
    : null

  const summary: [string, string][] = [
    ['Nome', data.name],
    ['Telefone', data.phone],
    ['Data', formatDateLong(data.date)],
    ['Horário', data.time],
    ['Pessoas', `${data.guests} ${data.guests === 1 ? 'pessoa' : 'pessoas'}`],
    ['Observações', data.notes || '—'],
  ]

  const stepAnim = {
    initial: { opacity: 0, x: reduce ? 0 : 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reduce ? 0 : -24 },
    transition: { duration: reduce ? 0.15 : 0.45, ease: EASE },
  }

  return (
    <section id="reservas" aria-labelledby="reservas-titulo" className="section-y relative bg-forest text-on-dark">
      <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Coluna editorial */}
        <div className="lg:col-span-5">
          <div id="reservas-titulo">
            <SectionHeading tone="dark" eyebrow={reservations.eyebrow} title={reservations.title} />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[length:var(--text-lead)] leading-relaxed text-on-dark-soft">{reservations.description}</p>
          </Reveal>

          <ImageReveal className="mt-10 hidden aspect-[5/4] overflow-hidden lg:block" delay={0.1}>
            <Photo src={photos.reservation.src} alt={photos.reservation.alt} width={900} sizes="38vw" tone="dark" />
          </ImageReveal>

          <Reveal delay={0.15} className="mt-10">
            <p className="eyebrow mb-4 text-[0.65rem] text-clay-light">Horários</p>
            <dl className="divide-y divide-forest-line border-y border-forest-line text-[0.95rem]">
              {site.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                  <dt className="text-on-dark">{h.days}</dt>
                  <dd className="text-on-dark-soft">
                    {!h.lunch && !h.dinner ? 'Fechado' : [h.lunch && `Almoço ${h.lunch}`, h.dinner && `Jantar ${h.dinner}`].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Formulário */}
        <Reveal delay={0.1} y={40} className="lg:col-span-7">
          <div className="relative border border-forest-line bg-forest-2 p-6 sm:p-10 lg:p-12">
            {/* indicador de etapas */}
            <ol className="mb-10 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em]" aria-label="Etapas da reserva">
              {[
                ['form', 'Dados'],
                ['review', 'Conferência'],
                ['done', 'Solicitação'],
              ].map(([k, label], i) => {
                const order = ['form', 'review', 'done'].indexOf(step)
                const state = i < order ? 'done' : i === order ? 'current' : 'next'
                return (
                  <li key={k} className="flex items-center gap-3" aria-current={state === 'current' ? 'step' : undefined}>
                    <span
                      className={
                        'grid h-7 w-7 place-items-center rounded-full border text-[0.7rem] transition-colors ' +
                        (state === 'current'
                          ? 'border-clay-light bg-clay-light text-forest'
                          : state === 'done'
                            ? 'border-clay-light text-clay-light'
                            : 'border-forest-line text-on-dark-soft')
                      }
                    >
                      {i + 1}
                    </span>
                    <span className={'hidden sm:inline ' + (state === 'next' ? 'text-on-dark-soft' : 'text-on-dark')}>{label}</span>
                    {i < 2 && <span aria-hidden="true" className="h-px w-6 bg-forest-line sm:w-10" />}
                  </li>
                )
              })}
            </ol>

            <div ref={stepRef} tabIndex={-1} className="scroll-mt-28 outline-none">
              <AnimatePresence mode="wait" initial={false}>
                {step === 'form' && (
                  <motion.form key="form" {...stepAnim} noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField id="rs-name" label="Nome" required error={errors.name} className="sm:col-span-2">
                      <input
                        id="rs-name"
                        className="field"
                        autoComplete="name"
                        placeholder="Como devemos chamar você?"
                        maxLength={80}
                        value={data.name}
                        onChange={(e) => set('name', e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-required="true"
                        aria-describedby={describedBy('rs-name', errors.name)}
                      />
                    </FormField>

                    <FormField id="rs-phone" label="Telefone" required error={errors.phone} hint="Usado apenas para confirmar a reserva" className="sm:col-span-2">
                      <input
                        id="rs-phone"
                        className="field"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(11) 91234-5678"
                        value={data.phone}
                        onChange={(e) => set('phone', maskPhone(e.target.value))}
                        aria-invalid={!!errors.phone}
                        aria-required="true"
                        aria-describedby={describedBy('rs-phone', errors.phone, 'hint')}
                      />
                    </FormField>

                    <FormField id="rs-date" label="Data" required error={errors.date}>
                      <div className="relative">
                        <input
                          id="rs-date"
                          className="field pr-11 [color-scheme:dark]"
                          type="date"
                          min={todayISO()}
                          max={addDaysISO(cfg.maxDaysAhead)}
                          value={data.date}
                          onChange={(e) => set('date', e.target.value)}
                          aria-invalid={!!errors.date}
                          aria-required="true"
                          aria-describedby={describedBy('rs-date', errors.date)}
                        />
                      </div>
                    </FormField>

                    <FormField
                      id="rs-time"
                      label="Horário"
                      required
                      error={errors.time}
                      hint={slots.closed ? 'Fechado neste dia' : !data.date ? 'Escolha a data para ver os horários' : undefined}
                    >
                      <select
                        id="rs-time"
                        className="field appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10 disabled:opacity-50"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23f3eee2' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
                        }}
                        value={data.time}
                        onChange={(e) => set('time', e.target.value)}
                        disabled={!data.date || slots.closed}
                        aria-invalid={!!errors.time}
                        aria-required="true"
                        aria-describedby={describedBy('rs-time', errors.time, !data.date || slots.closed ? 'hint' : undefined)}
                      >
                        <option value="">{slots.closed ? 'Fechado' : 'Selecione'}</option>
                        {slots.lunch.length > 0 && (
                          <optgroup label="Almoço">
                            {slots.lunch.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {slots.dinner.length > 0 && (
                          <optgroup label="Jantar">
                            {slots.dinner.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {data.date && !slots.closed && !slots.lunch.length && !slots.dinner.length && (
                          <option value="" disabled>
                            Sem horários restantes hoje
                          </option>
                        )}
                      </select>
                    </FormField>

                    <FormField id="rs-guests" label="Número de pessoas" required error={errors.guests} hint={cfg.largeGroupNote} className="sm:col-span-2">
                      <div className="flex items-stretch">
                        <button
                          type="button"
                          onClick={() => set('guests', Math.max(cfg.minGuests, data.guests - 1))}
                          disabled={data.guests <= cfg.minGuests}
                          className="grid w-14 place-items-center border border-forest-line text-on-dark transition-colors hover:bg-forest-3 disabled:opacity-35"
                          aria-label="Diminuir número de pessoas"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          id="rs-guests"
                          className="field -mx-px w-24 text-center tabular-nums"
                          type="number"
                          inputMode="numeric"
                          min={cfg.minGuests}
                          max={cfg.maxGuests}
                          value={Number.isNaN(data.guests) ? '' : data.guests}
                          onChange={(e) => set('guests', e.target.value === '' ? NaN : Math.round(Number(e.target.value)))}
                          aria-invalid={!!errors.guests}
                          aria-required="true"
                          aria-describedby={describedBy('rs-guests', errors.guests, 'hint')}
                        />
                        <button
                          type="button"
                          onClick={() => set('guests', Math.min(cfg.maxGuests, (data.guests || 0) + 1))}
                          disabled={data.guests >= cfg.maxGuests}
                          className="grid w-14 place-items-center border border-forest-line text-on-dark transition-colors hover:bg-forest-3 disabled:opacity-35"
                          aria-label="Aumentar número de pessoas"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </FormField>

                    <FormField id="rs-notes" label="Observações" className="sm:col-span-2" hint="Alergias, ocasião especial, preferência de mesa ou experiência desejada">
                      <textarea
                        id="rs-notes"
                        className="field min-h-28 resize-y"
                        maxLength={300}
                        value={data.notes}
                        onChange={(e) => set('notes', e.target.value)}
                        aria-describedby="rs-notes-dica"
                      />
                    </FormField>

                    <div className="flex flex-col gap-5 sm:col-span-2">
                      <button type="submit" className="btn btn-primary w-full">
                        Revisar reserva
                      </button>
                      <p className="flex items-start gap-2 text-[0.8rem] text-on-dark-soft">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        {reservations.demoNotice}
                      </p>
                    </div>
                  </motion.form>
                )}

                {step === 'review' && (
                  <motion.div key="review" {...stepAnim}>
                    <p className="font-display opsz-max text-[clamp(1.75rem,1.4rem+1.2vw,2.4rem)] leading-tight">Confira os dados da sua reserva.</p>
                    <p className="mt-2 text-on-dark-soft">Se algo estiver errado, volte e edite antes de enviar.</p>
                    <dl className="mt-8 grid grid-cols-1 gap-x-10 border-t border-forest-line sm:grid-cols-2">
                      {summary.map(([k, v]) => (
                        <div key={k} className={'border-b border-forest-line py-4 ' + (k === 'Observações' ? 'sm:col-span-2' : '')}>
                          <dt className="eyebrow text-[0.62rem] text-on-dark-soft">{k}</dt>
                          <dd className="mt-1.5 break-words text-[1.05rem] text-on-dark first-letter:uppercase">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                      <button type="button" onClick={() => setStep('form')} className="btn btn-ghost-dark" disabled={loading}>
                        <ArrowLeft className="h-4 w-4" />
                        Editar dados
                      </button>
                      <button type="button" onClick={confirm} className="btn btn-primary min-w-[15rem]" disabled={loading} aria-busy={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando solicitação
                          </>
                        ) : (
                          'Enviar solicitação'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'done' && (
                  <motion.div key="done" {...stepAnim} role="status">
                    <CheckCircle2 className="h-11 w-11 text-clay-light" strokeWidth={1.3} />
                    <p className="font-display opsz-max mt-6 text-[clamp(1.75rem,1.4rem+1.2vw,2.4rem)] leading-tight">
                      Solicitação demonstrativa registrada, {data.name.split(' ')[0]}.
                    </p>
                    <p className="mt-4 max-w-xl leading-relaxed text-on-dark-soft">
                      Em um site real, o restaurante receberia este pedido e entraria em contato para confirmar.
                      <strong className="font-semibold text-on-dark"> Esta é uma demonstração: nenhuma reserva foi criada</strong> e nenhum dado foi
                      enviado ou armazenado.
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-forest-line py-5 text-on-dark">
                      <li className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-clay-light" />
                        <span className="first-letter:uppercase">{formatDateLong(data.date)}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-clay-light" />
                        {data.time}
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-clay-light" />
                        {data.guests} {data.guests === 1 ? 'pessoa' : 'pessoas'}
                      </li>
                    </ul>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      {whatsappHref ? (
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                          <MessageCircle className="h-4 w-4" />
                          Enviar pelo WhatsApp
                        </a>
                      ) : null}
                      <button type="button" onClick={reset} className="btn btn-ghost-dark">
                        Fazer nova solicitação
                      </button>
                    </div>
                    {!whatsappHref && (
                      <p className="mt-6 flex items-start gap-2 text-[0.8rem] text-on-dark-soft">
                        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        O envio do resumo por WhatsApp fica disponível quando o número do restaurante é configurado.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
