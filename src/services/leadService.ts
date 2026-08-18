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
 * Отправка в Bitrix24 REST API: создает Сделку (Deal) в колонке "New" на Канбан-доске
 */
async function sendToBitrix24(lead: LeadData): Promise<void> {
  try {
    const contact = lead.phone || lead.contact || ''
    const name = lead.name || (lead.formType === 'quiz' ? 'Клієнт з квізу' : 'Клієнт з сайту')
    const route = [lead.origin, lead.destination].filter(Boolean).join(' -> ')

    const commentsList = [
      `Джерело: ${lead.formType === 'quiz' ? 'Квіз-калькулятор' : lead.formType === 'quick_calc' ? 'Швидкий розрахунок' : 'Контактна форма'}`,
      name ? `Клієнт: ${name}` : '',
      contact ? `Телефон: ${contact}` : '',
      route ? `Маршрут: ${route}` : '',
      lead.cargoType ? `Вантаж: ${lead.cargoType}` : '',
      lead.weight || lead.volume ? `Вага/Об'єм: ${lead.weight || '-'}т / ${lead.volume || '-'}м³` : '',
      lead.extras?.length ? `Додаткові послуги: ${lead.extras.join(', ')}` : '',
      lead.comment ? `Коментар: ${lead.comment}` : '',
      `Мова інтерфейсу: ${lead.lang || 'UK'}`,
    ].filter(Boolean).join('\n')

    const dealTitle = `Заявка: ${route || lead.cargoType || 'Логістика'} (${contact || name})`

    // 1. Создаем Контакт (Contact) в Bitrix24
    let contactId: number | null = null
    try {
      const contactParams = new URLSearchParams()
      contactParams.append('fields[NAME]', name)
      if (contact) {
        contactParams.append('fields[PHONE][0][VALUE]', contact)
        contactParams.append('fields[PHONE][0][VALUE_TYPE]', 'WORK')
      }
      contactParams.append('fields[SOURCE_ID]', 'WEB')
      contactParams.append('fields[OPENED]', 'Y')

      const contactRes = await fetch(`${BITRIX24_WEBHOOK}crm.contact.add.json`, {
        method: 'POST',
        body: contactParams,
      })
      const contactData = await contactRes.json()
      if (contactData && contactData.result) {
        contactId = Number(contactData.result)
      }
    } catch {
      // Игнорируем ошибку контакта, сделка все равно создастся
    }

    // 2. Создаем ровно 1 Сделку (Deal) в колонке "New" канбана
    const dealParams = new URLSearchParams()
    dealParams.append('fields[TITLE]', dealTitle)
    dealParams.append('fields[CATEGORY_ID]', '0')
    dealParams.append('fields[STAGE_ID]', 'NEW')
    if (contactId) {
      dealParams.append('fields[CONTACT_ID]', String(contactId))
    }
    dealParams.append('fields[COMMENTS]', commentsList)
    dealParams.append('fields[SOURCE_ID]', 'WEB')
    dealParams.append('fields[OPENED]', 'Y')

    await fetch(`${BITRIX24_WEBHOOK}crm.deal.add.json`, {
      method: 'POST',
      body: dealParams,
    })
  } catch (err) {
    console.warn('Bitrix24 submission error:', err)
  }
}

/**
 * Единая функция отправки лида с сайта:
 * 1. Отправляет уведомление в Telegram Bot (группа grandlog)
 * 2. Создаёт сделку в Bitrix24 CRM (через URLSearchParams)
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
