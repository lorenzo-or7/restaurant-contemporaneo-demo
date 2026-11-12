import { ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { photos } from '../config/images'
import { events } from '../content/sections'
import { Photo } from '../components/Photo'
import { Dialog } from '../components/Dialog'
import { FormField, describedBy } from '../components/FormField'
import { Parallax, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'
import { addDaysISO, formatDateLong, isValidEmail, isValidName, isValidPhone, maskPhone, sanitizeText } from '../lib/validation'

export function Events() {
  const [open, setOpen] = useState(false)

  return (
    <section id="eventos" aria-labelledby="eventos-titulo" className="relative isolate overflow-hidden bg-forest text-on-dark">
      <Parallax range={70} className="absolute inset-0 -z-10 h-[120%] -translate-y-[10%]">
        <Photo src={photos.eventsHero.src} alt={photos.eventsHero.alt} width={1800} sizes="100vw" tone="dark" />
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/88 to-forest/30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest/90 via-transparent to-transparent lg:hidden" />

      <div className="container-x section-y grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6" id="eventos-titulo">
          <SectionHeading tone="dark" eyebrow={events.eyebrow} title={events.title} />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-on-dark/80">{events.description}</p>
          </Reveal>

          <ul className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {events.occasions.map((o, i) => (
              <Reveal as="li" key={o.title} delay={0.1 + i * 0.07} className="border-t border-on-dark/20 py-5">
                <p className="font-display text-[1.3rem] leading-tight">{o.title}</p>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-on-dark-soft">{o.text}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.3} className="mt-10">
            <button type="button" onClick={() => setOpen(true)} className="btn btn-primary group" aria-haspopup="dialog">
              {events.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
            </button>
          </Reveal>
        </div>
      </div>

      <EventDialog open={open} onClose={() => setOpen(false)} />
    </section>
  )
}

type EventData = { name: string; phone: string; email: string; type: string; date: string; guests: string; message: string }
const empty: EventData = { name: '', phone: '', email: '', type: '', date: '', guests: '', message: '' }

function validate(d: EventData) {
  const e: Partial<Record<keyof EventData, string>> = {}
  if (!isValidName(d.name)) e.name = 'Informe seu nome (mínimo de 3 letras).'
  if (!isValidPhone(d.phone)) e.phone = 'Informe um telefone com DDD, ex.: (11) 91234-5678.'
  if (d.email && !isValidEmail(d.email)) e.email = 'Confira o e-mail informado.'
  if (!d.type) e.type = 'Escolha o tipo de ocasião.'
  if (!d.date) e.date = 'Escolha uma data aproximada.'
  else if (d.date < addDaysISO(3)) e.date = 'Para eventos, escolha uma data com pelo menos 3 dias de antecedência.'
  const g = Number(d.guests)
  if (!d.guests) e.guests = 'Informe o número de convidados.'
  else if (!Number.isInteger(g) || g < 2 || g > 24) e.guests = 'Recebemos de 2 a 24 convidados no salão reservado.'
  return e
}

function EventDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [data, setData] = useState<EventData>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof EventData, string>>>({})
  const [sent, setSent] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (sent) doneRef.current?.focus()
  }, [sent])

  const set = (k: keyof EventData, v: string) => {
    setData((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const close = () => {
    onClose()
    window.setTimeout(() => {
      setSent(false)
      setData(empty)
      setErrors({})
    }, 400)
  }

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const clean = { ...data, name: sanitizeText(data.name, 80), message: sanitizeText(data.message, 600) }
    const e = validate(clean)
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      document.getElementById(`ev-${first}`)?.focus()
      return
    }
    setData(clean)
    setSent(true)
  }

  return (
    <Dialog open={open} onClose={close} title="Planejar uma ocasião especial" className="max-w-2xl sm:max-h-[90dvh]" closeLabel="Fechar formulário de evento">
      <div className="overflow-y-auto p-6 sm:p-10">
        {!sent ? (
          <>
            <p className="eyebrow text-[0.65rem] text-clay">{events.eyebrow}</p>
            <p className="font-display opsz-max mt-3 pr-10 text-[2rem] leading-[1.08] text-ink">Conte o que você quer celebrar.</p>
            <p className="mt-3 text-ink-soft">Envie os detalhes e a equipe de eventos retorna com propostas de menu e disponibilidade.</p>

            <form noValidate onSubmit={submit} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField tone="light" id="ev-name" label="Nome" required error={errors.name} className="sm:col-span-2">
                <input
                  id="ev-name"
                  className="field field-light"
                  autoComplete="name"
                  value={data.name}
                  maxLength={80}
                  onChange={(e) => set('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy('ev-name', errors.name)}
                  aria-required="true"
                  data-autofocus
                />
              </FormField>
              <FormField tone="light" id="ev-phone" label="Telefone" required error={errors.phone}>
                <input
                  id="ev-phone"
                  className="field field-light"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(11) 91234-5678"
                  value={data.phone}
                  onChange={(e) => set('phone', maskPhone(e.target.value))}
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy('ev-phone', errors.phone)}
                  aria-required="true"
                />
              </FormField>
              <FormField tone="light" id="ev-email" label="E-mail" error={errors.email}>
                <input
                  id="ev-email"
                  className="field field-light"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  maxLength={120}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy('ev-email', errors.email)}
                />
              </FormField>
              <FormField tone="light" id="ev-type" label="Tipo de ocasião" required error={errors.type}>
                <select
                  id="ev-type"
                  className="field field-light appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2325281f' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
                  value={data.type}
                  onChange={(e) => set('type', e.target.value)}
                  aria-invalid={!!errors.type}
                  aria-describedby={describedBy('ev-type', errors.type)}
                  aria-required="true"
                >
                  <option value="">Selecione</option>
                  {events.occasionTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </FormField>
              <FormField tone="light" id="ev-date" label="Data aproximada" required error={errors.date}>
                <input
                  id="ev-date"
                  className="field field-light"
                  type="date"
                  min={addDaysISO(3)}
                  max={addDaysISO(365)}
                  value={data.date}
                  onChange={(e) => set('date', e.target.value)}
                  aria-invalid={!!errors.date}
                  aria-describedby={describedBy('ev-date', errors.date)}
                  aria-required="true"
                />
              </FormField>
              <FormField tone="light" id="ev-guests" label="Convidados" required error={errors.guests} hint="De 2 a 24 pessoas">
                <input
                  id="ev-guests"
                  className="field field-light"
                  type="number"
                  inputMode="numeric"
                  min={2}
                  max={24}
                  value={data.guests}
                  onChange={(e) => set('guests', e.target.value.replace(/\D/g, '').slice(0, 2))}
                  aria-invalid={!!errors.guests}
                  aria-describedby={describedBy('ev-guests', errors.guests, 'De 2 a 24 pessoas')}
                  aria-required="true"
                />
              </FormField>
              <FormField tone="light" id="ev-message" label="Conte um pouco sobre a ocasião" className="sm:col-span-2">
                <textarea
                  id="ev-message"
                  className="field field-light min-h-28 resize-y"
                  maxLength={600}
                  value={data.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </FormField>
              <div className="sm:col-span-2">
                <p className="mb-5 flex items-start gap-2 text-[0.82rem] text-ink-soft">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  Demonstração: nada é enviado ou armazenado, e nenhum evento é agendado.
                </p>
                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  Enviar solicitação
                </button>
              </div>
            </form>
          </>
        ) : (
          <div role="status" ref={doneRef} tabIndex={-1} className="py-4 outline-none">
            <CheckCircle2 className="h-10 w-10 text-olive" strokeWidth={1.4} />
            <p className="font-display opsz-max mt-5 text-[2rem] leading-tight text-ink">Solicitação demonstrativa recebida.</p>
            <p className="mt-3 text-ink-soft">
              Em um site real, a equipe de eventos receberia os dados abaixo. <strong className="font-semibold text-ink">Nenhum evento foi agendado</strong> e nenhum dado foi enviado.
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 text-[0.95rem] sm:grid-cols-2">
              {[
                ['Nome', data.name],
                ['Telefone', data.phone],
                ['Ocasião', data.type],
                ['Data', formatDateLong(data.date)],
                ['Convidados', `${data.guests} pessoas`],
                ['E-mail', data.email || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-[0.62rem] text-ink-soft">{k}</dt>
                  <dd className="mt-1 text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <button type="button" onClick={close} className="btn btn-ghost-light mt-10">
              Concluir
            </button>
          </div>
        )}
      </div>
    </Dialog>
  )
}
