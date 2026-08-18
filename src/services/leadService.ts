import { trackLeadEvent } from '../utils/analytics'

export interface LeadData {
  formType: 'contact_form' | 'quick_calc' | 'quiz'
  name?: string
  phone?: string
  contact?: string
  origin?: string
  destination?: string
  cargoType?: string
  weight?: string
  volume?: string
  extras?: string[]
  comment?: string
  lang?: string
}

const TG_BOT_TOKEN = '8808616806:AAG1SuTDTZ4ZdBftTedFIvpUocEdXthqQRE'
const TG_CHAT_ID = '-5009438060'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatTelegramMessage(lead: LeadData): string {
  const dateStr = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })

  let title = '📬 <b>НОВА ЗАЯВКА З САЙТУ</b>'
  if (lead.formType === 'quiz') {
    title = '🎯 <b>НОВА ЗАЯВКА: КВІЗ-КАЛЬКУЛЯТОР</b>'
  } else if (lead.formType === 'quick_calc') {
    title = '⚡ <b>НОВА ЗАЯВКА: ШВИДКИЙ РОЗРАХУНОК</b>'
  } else {
    title = '📝 <b>НОВА ЗАЯВКА: КОНТАКТНА ФОРМА</b>'
  }

  const lines: string[] = [
    title,
    `🕒 <i>${dateStr} (Київ)</i>`,
    '━━━━━━━━━━━━━━━━━━━━',
  ]

  const contact = lead.phone || lead.contact || 'Не вказано'

  if (lead.name) {
    lines.push(`👤 <b>Клієнт:</b> ${escapeHtml(lead.name)}`)
  }
  lines.push(`📱 <b>Контакт:</b> <code>${escapeHtml(contact)}</code>`)

  if (lead.origin || lead.destination) {
    const route = `${lead.origin || '—'} ➔ ${lead.destination || '—'}`
    lines.push(`🗺 <b>Маршрут:</b> <b>${escapeHtml(route)}</b>`)
  }

  if (lead.cargoType) {
    lines.push(`📦 <b>Тип вантажу:</b> ${escapeHtml(lead.cargoType)}`)
  }

  if (lead.weight || lead.volume) {
    const weightStr = lead.weight ? `${lead.weight} т` : ''
    const volumeStr = lead.volume ? `${lead.volume} м³` : ''
    const params = [weightStr, volumeStr].filter(Boolean).join(' / ')
    lines.push(`⚖️ <b>Параметри:</b> ${escapeHtml(params)}`)
  }

  if (lead.extras && lead.extras.length > 0) {
    lines.push(`🛠 <b>Додаткові послуги:</b>\n• ${lead.extras.map(escapeHtml).join('\n• ')}`)
  }

  if (lead.comment) {
    lines.push(`💬 <b>Коментар:</b> <i>${escapeHtml(lead.comment)}</i>`)
  }

  if (lead.lang) {
    lines.push(`🌐 <b>Мова інтерфейсу:</b> ${lead.lang}`)
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━')
  lines.push('🚀 <i>Grand Logistics Global Platform</i>')

  return lines.join('\n')
}

/**
 * Единая функция отправки лида:
 * 1. Отправляет событие аналитики (GA4 + Meta Pixel)
 * 2. Мгновенно отправляет в Telegram Bot API (из браузера — CORS разрешён)
 * 3. Отправляет данные на /api/lead (serverless) — тот создаёт сделку в Bitrix24 server-side
 */
export async function submitLead(lead: LeadData): Promise<{ success: boolean; message?: string }> {
  // 1. Аналитика
  trackLeadEvent({
    formType: lead.formType,
    cargoType: lead.cargoType,
    route: [lead.origin, lead.destination].filter(Boolean).join(' -> '),
  })

  try {
    const tgText = formatTelegramMessage(lead)

    // 2. Telegram — прямо из браузера (api.telegram.org разрешает CORS)
    const tgPromise = fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: tgText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    // 3. Bitrix24 — через Vercel serverless function (server-side, без CORS ограничений)
    const b24Promise = fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })

    const [tgRes, b24Res] = await Promise.all([tgPromise, b24Promise])

    const tgData = await tgRes.json()
    const b24Data = await b24Res.json().catch(() => ({ success: false }))

    console.log('[Lead] Telegram:', tgData.ok, '| Bitrix24:', b24Data)

    if (tgData.ok) {
      return { success: true }
    }
    return { success: false, message: tgData.description || 'Telegram API error' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error'
    return { success: false, message: errorMsg }
  }
}
