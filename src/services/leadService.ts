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

function formatTelegramDirectMessage(lead: LeadData): string {
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
  const name = lead.name || 'Клієнт'

  lines.push(`👤 <b>Клієнт:</b> ${escapeHtml(name)}`)
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
 * Отправка в Bitrix24 REST API
 */
async function sendToBitrix24(lead: LeadData): Promise<void> {
  try {
    const contact = lead.phone || lead.contact || ''
    const name = lead.name || (lead.formType === 'quiz' ? 'Клієнт з квізу' : 'Клієнт з сайту')
    const route = [lead.origin, lead.destination].filter(Boolean).join(' -> ')

    const commentsList = [
      `Джерело форми: ${lead.formType}`,
      route ? `Маршрут: ${route}` : '',
      lead.cargoType ? `Вантаж: ${lead.cargoType}` : '',
      lead.weight || lead.volume ? `Вага/Об'єм: ${lead.weight || '-'}т / ${lead.volume || '-'}м³` : '',
      lead.extras?.length ? `Послуги: ${lead.extras.join(', ')}` : '',
      lead.comment ? `Коментар: ${lead.comment}` : '',
      `Мова: ${lead.lang || 'UK'}`,
    ].filter(Boolean).join('\n')

    // 1. Создаем Lead в CRM
    await fetch(`${BITRIX24_WEBHOOK}crm.lead.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          TITLE: `Заявка: ${lead.cargoType || 'Вантаж'} (${name})`,
          NAME: name,
          PHONE: contact ? [{ VALUE: contact, VALUE_TYPE: 'WORK' }] : [],
          COMMENTS: commentsList,
          SOURCE_ID: 'WEB',
          OPENED: 'Y',
        },
      }),
    })

    // 2. Создаем Deal (Сделка на канбан-доске)
    await fetch(`${BITRIX24_WEBHOOK}crm.deal.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          TITLE: `Заявка: ${route || lead.cargoType || 'Логістика'} (${name})`,
          COMMENTS: `Контакт: ${contact}\n${commentsList}`,
          SOURCE_ID: 'WEB',
          OPENED: 'Y',
        },
      }),
    })
  } catch (err) {
    console.warn('Bitrix24 submission error:', err)
  }
}

/**
 * Единая функция отправки лида с сайта:
 * 1. Отправляет уведомление в Telegram Bot (группа grandlog)
 * 2. Создаёт лид и сделку в Bitrix24 CRM
 * 3. Отправляет событие аналитики в GA4 и Meta Pixel
 */
export async function submitLead(lead: LeadData): Promise<{ success: boolean; message?: string }> {
  // 1. Аналитика (Google Analytics 4 + Meta Pixel)
  trackLeadEvent({
    formType: lead.formType,
    cargoType: lead.cargoType,
    route: [lead.origin, lead.destination].filter(Boolean).join(' -> '),
  })

  // 2. Параллельная отправка в Telegram Bot API и Bitrix24 CRM
  try {
    const text = formatTelegramDirectMessage(lead)

    const [tgRes] = await Promise.all([
      fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }),
      sendToBitrix24(lead),
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
