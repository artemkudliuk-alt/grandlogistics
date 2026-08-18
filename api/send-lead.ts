export const config = {
  runtime: 'edge',
}

interface LeadPayload {
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
  url?: string
}

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '8808616806:AAG1SuTDTZ4ZdBftTedFIvpUocEdXthqQRE'
const TG_CHAT_ID = process.env.TG_CHAT_ID || '-5009438060'
const BITRIX24_WEBHOOK_URL = process.env.BITRIX24_WEBHOOK_URL || ''

function formatTelegramMessage(lead: LeadPayload): string {
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function sendToTelegram(message: string): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    const data = await res.json()
    return data.ok === true
  } catch (err) {
    console.error('Telegram send error:', err)
    return false
  }
}

async function sendToBitrix24(lead: LeadPayload): Promise<void> {
  if (!BITRIX24_WEBHOOK_URL) return

  try {
    const contact = lead.phone || lead.contact || ''
    const name = lead.name || 'Заявка з сайту'
    const route = [lead.origin, lead.destination].filter(Boolean).join(' -> ')

    const commentsList = [
      `Форма: ${lead.formType}`,
      route ? `Маршрут: ${route}` : '',
      lead.cargoType ? `Вантаж: ${lead.cargoType}` : '',
      lead.weight || lead.volume ? `Вага/Об'єм: ${lead.weight || '-'}т / ${lead.volume || '-'}м3` : '',
      lead.extras?.length ? `Доп. послуги: ${lead.extras.join(', ')}` : '',
      lead.comment ? `Коментар: ${lead.comment}` : '',
    ].filter(Boolean).join('\n')

    const cleanWebhook = BITRIX24_WEBHOOK_URL.replace(/\/+$/, '')
    const apiUrl = `${cleanWebhook}/crm.lead.add.json`

    await fetch(apiUrl, {
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
  } catch (err) {
    console.error('Bitrix24 send error:', err)
  }
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const lead: LeadPayload = await req.json()

    if (!lead.phone && !lead.contact && !lead.name) {
      return new Response(JSON.stringify({ error: 'Contact or name required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const message = formatTelegramMessage(lead)

    // Параллельная отправка в Telegram и Bitrix24
    const [tgOk] = await Promise.all([
      sendToTelegram(message),
      sendToBitrix24(lead),
    ])

    if (!tgOk) {
      return new Response(JSON.stringify({ ok: false, message: 'Failed to send to Telegram' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, message: 'Lead sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
