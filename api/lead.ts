import type { VercelRequest, VercelResponse } from '@vercel/node'

const TG_BOT_TOKEN = '8808616806:AAG1SuTDTZ4ZdBftTedFIvpUocEdXthqQRE'
const TG_CHAT_ID = '-5009438060'
const BITRIX24_WEBHOOK = 'https://b24-9u8crp.bitrix24.com/rest/1/vankzff8r2191ma0/'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Удаление 4-байтных эмодзи для совместимости с MySQL utf8 базой Bitrix24
function stripEmojis(text: string): string {
  return text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const lead = req.body || {}
  const contact = lead.phone || lead.contact || 'Не вказано'
  const name = lead.name || (lead.formType === 'quiz' ? 'Клієнт з квізу' : 'Клієнт з сайту')
  const route = [lead.origin, lead.destination].filter(Boolean).join(' -> ')

  // 1. Telegram Message (с красивыми эмодзи)
  const dateStr = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })
  let tgTitle = '📬 <b>НОВА ЗАЯВКА З САЙТУ</b>'
  if (lead.formType === 'quiz') tgTitle = '🎯 <b>НОВА ЗАЯВКА: КВІЗ-КАЛЬКУЛЯТОР</b>'
  else if (lead.formType === 'quick_calc') tgTitle = '⚡ <b>НОВА ЗАЯВКА: ШВИДКИЙ РОЗРАХУНОК</b>'
  else tgTitle = '📝 <b>НОВА ЗАЯВКА: КОНТАКТНА ФОРМА</b>'

  const tgLines: string[] = [
    tgTitle,
    `🕒 <i>${dateStr} (Київ)</i>`,
    '━━━━━━━━━━━━━━━━━━━━',
    `👤 <b>Клієнт:</b> ${escapeHtml(name)}`,
    `📱 <b>Контакт:</b> <code>${escapeHtml(contact)}</code>`,
  ]
  if (lead.origin || lead.destination) {
    tgLines.push(`🗺 <b>Маршрут:</b> <b>${escapeHtml(`${lead.origin || '—'} ➔ ${lead.destination || '—'}`)}</b>`)
  }
  if (lead.cargoType) tgLines.push(`📦 <b>Тип вантажу:</b> ${escapeHtml(lead.cargoType)}`)
  if (lead.weight || lead.volume) {
    const params = [lead.weight ? `${lead.weight} т` : '', lead.volume ? `${lead.volume} м³` : ''].filter(Boolean).join(' / ')
    tgLines.push(`⚖️ <b>Параметри:</b> ${escapeHtml(params)}`)
  }
  if (lead.extras && lead.extras.length > 0) {
    tgLines.push(`🛠 <b>Додаткові послуги:</b>\n• ${lead.extras.map(escapeHtml).join('\n• ')}`)
  }
  if (lead.comment) tgLines.push(`💬 <b>Коментар:</b> <i>${escapeHtml(lead.comment)}</i>`)
  if (lead.lang) tgLines.push(`🌐 <b>Мова інтерфейсу:</b> ${lead.lang}`)
  tgLines.push('━━━━━━━━━━━━━━━━━━━━')
  tgLines.push('🚀 <i>Grand Logistics Global Platform</i>')

  // 2. Чистый текст для Bitrix24 (без 4-байтных эмодзи)
  const cleanName = stripEmojis(name)
  const cleanContact = stripEmojis(contact)
  const cleanRoute = stripEmojis(route)
  const cleanCargo = stripEmojis(lead.cargoType || '')

  const commentsList = [
    `Джерело: ${lead.formType === 'quiz' ? 'Квіз-калькулятор' : lead.formType === 'quick_calc' ? 'Швидкий розрахунок' : 'Контактна форма'}`,
    `Клієнт: ${cleanName}`,
    `Телефон: ${cleanContact}`,
    cleanRoute ? `Маршрут: ${cleanRoute}` : '',
    cleanCargo ? `Вантаж: ${cleanCargo}` : '',
    lead.weight || lead.volume ? `Вага/Об'єм: ${lead.weight || '-'}т / ${lead.volume || '-'}м3` : '',
    lead.extras?.length ? `Послуги: ${lead.extras.map(stripEmojis).join(', ')}` : '',
    lead.comment ? `Коментар: ${stripEmojis(lead.comment)}` : '',
  ].filter(Boolean).join('\n')

  const dealTitle = stripEmojis(`Заявка: ${cleanRoute || cleanCargo || 'Логістика'} (${cleanContact || cleanName})`)

  try {
    // 1. Отправка в Telegram
    const tgPromise = fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: tgLines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    // 2. Создание контакта в Bitrix24
    let contactId: number | null = null
    try {
      const contactRes = await fetch(`${BITRIX24_WEBHOOK}crm.contact.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            NAME: cleanName,
            PHONE: cleanContact ? [{ VALUE: cleanContact, VALUE_TYPE: 'WORK' }] : [],
            COMMENTS: commentsList,
            SOURCE_ID: 'WEB',
            OPENED: 'Y',
          },
        }),
      })
      const contactData = await contactRes.json()
      if (contactData && contactData.result) {
        contactId = Number(contactData.result)
      }
    } catch (e) {
      console.warn('Contact create error:', e)
    }

    // 3. Создание Сделки в Bitrix24
    const b24DealRes = await fetch(`${BITRIX24_WEBHOOK}crm.deal.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          TITLE: dealTitle,
          STAGE_ID: 'NEW',
          CATEGORY_ID: 0,
          ASSIGNED_BY_ID: 1,
          CONTACT_ID: contactId || undefined,
          COMMENTS: commentsList,
          SOURCE_ID: 'WEB',
          OPENED: 'Y',
        },
      }),
    })

    const [tgRes] = await Promise.all([tgPromise])
    const tgData = await tgRes.json()
    const b24Data = await b24DealRes.json()

    return res.status(200).json({
      success: true,
      telegram: tgData.ok,
      bitrixDealId: b24Data.result,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ success: false, error: errorMsg })
  }
}
