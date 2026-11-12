/** Remove caracteres de controle, tags e espaços excessivos. */
export function sanitizeText(value: string, max = 500) {
  return value
    .replace(/[<>]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, max)
}

export const onlyDigits = (v: string) => v.replace(/\D/g, '')

/** Máscara progressiva para telefone brasileiro: (11) 91234-5678 / (11) 1234-5678 */
export function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Valida telefone fixo (10 dígitos) ou celular (11 dígitos, começando com 9) com DDD válido. */
export function isValidPhone(value: string) {
  const d = onlyDigits(value)
  if (d.length !== 10 && d.length !== 11) return false
  const ddd = Number(d.slice(0, 2))
  if (ddd < 11 || ddd > 99 || d[0] === '0' || d[1] === '0') return false
  if (d.length === 11 && d[2] !== '9') return false
  if (/^(\d)\1+$/.test(d.slice(2))) return false
  return true
}

export function isValidName(value: string) {
  const v = sanitizeText(value, 80)
  return v.length >= 3 && /[A-Za-zÀ-ÿ]{2,}/.test(v)
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** Data local no formato YYYY-MM-DD (sem desvio de fuso). */
export function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISODate(v: string) {
  const [y, m, d] = v.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDaysISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function formatDateLong(v: string) {
  const d = parseISODate(v)
  if (!d) return v
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
