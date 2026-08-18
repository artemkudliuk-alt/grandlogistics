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
const BITRIX24_WEBHOOK = 'https://b24-9u8crp.bitrix24.com/rest/1/vankzff8r2191ma0/'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function stripEmojis(text: string): string {
  return text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()
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
 * Прямая отправка сделки в Bitrix24 через CORS-friendly x-www-form-urlencoded
 */
async function sendToBitrix24Direct(lead: LeadData): Promise<void> {
  const contact = lead.phone || lead.contact || ''
  const name = lead.name || ''
  const route = [lead.origin, lead.destination].filter(Boolean).join(' -> ')

  const cleanContact = stripEmojis(contact)
  const cleanName = stripEmojis(name)
  const cleanRoute = stripEmojis(route)
  const cleanCargo = stripEmojis(lead.cargoType || '')

  const commentsList = [
    `Джерело: ${lead.formType === 'quiz' ? 'Квіз-калькулятор' : lead.formType === 'quick_calc' ? 'Швидкий розрахунок' : 'Контактна форма'}`,
    cleanName ? `Клієнт: ${cleanName}` : '',
    `Телефон: ${cleanContact}`,
    cleanRoute ? `Маршрут: ${cleanRoute}` : '',
    cleanCargo ? `Вантаж: ${cleanCargo}` : '',
    lead.weight || lead.volume ? `Вага/Об'єм: ${lead.weight || '-'}т / ${lead.volume || '-'}м3` : '',
    lead.extras?.length ? `Послуги: ${lead.extras.map(stripEmojis).join(', ')}` : '',
    lead.comment ? `Коментар: ${stripEmojis(lead.comment)}` : '',
  ].filter(Boolean).join('\n')

  const titleIdentifier = cleanName ? `${cleanName} ${cleanContact}` : cleanContact
  const dealTitle = stripEmojis(`Заявка: ${cleanRoute || cleanCargo || 'Логістика'} (${titleIdentifier})`)

  const dealParams = new URLSearchParams({
    'fields[TITLE]': dealTitle,
    'fields[STAGE_ID]': 'NEW',
    'fields[CATEGORY_ID]': '0',
    'fields[ASSIGNED_BY_ID]': '1',
    'fields[COMMENTS]': commentsList,
    'fields[SOURCE_ID]': 'WEB',
    'fields[OPENED]': 'Y',
  })

  // Выполняем простой CORS-safe POST запрос
  try {
    await fetch(`${BITRIX24_WEBHOOK}crm.deal.add.json`, {
      method: 'POST',
      body: dealParams,
    })
  } catch (err) {
    console.warn('Bitrix24 direct fetch error:', err)
  }
}

/**
 * Единая функция отправки лида:
 * 1. Отправляет событие аналитики (GA4 + Meta Pixel)
 * 2. Мгновенно отправляет в Telegram Bot API
 * 3. Мгновенно создает сделку в Bitrix24 CRM
 */
export async function submitLead(lead: LeadData): Promise<{ success: boolean; message?: string }> {
  // 1. Аналитика
  trackLeadEvent({
    formType: lead.formType,
    cargoType: lead.cargoType,
    route: [lead.origin, lead.destination].filter(Boolean).join(' -> '),
  })

  // 2. Параллельная гарантированная доставка (Telegram + Bitrix24)
  try {
    const tgText = formatTelegramMessage(lead)

    const [tgRes] = await Promise.all([
      fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: tgText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }),
      sendToBitrix24Direct(lead),
    ])

    const tgData = await tgRes.json()
    if (tgData.ok) {
      return { success: true }
    }
    return { success: false, message: tgData.description || 'Telegram API error' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error'
    return { success: false, message: errorMsg }
  }
}
