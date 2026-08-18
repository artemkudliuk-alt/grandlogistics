import type { VercelRequest, VercelResponse } from '@vercel/node'

const BITRIX24_WEBHOOK = 'https://b24-9u8crp.bitrix24.com/rest/1/vankzff8r2191ma0/'

// Удаление 4-байтных эмодзи для совместимости с MySQL utf8 базой Bitrix24
function stripEmojis(text: string): string {
  return text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const lead = req.body || {}

  const contact = stripEmojis(lead.phone || lead.contact || 'Не вказано')
  const route = stripEmojis([lead.origin, lead.destination].filter(Boolean).join(' -> '))
  const cargo = stripEmojis(lead.cargoType || '')
  const formSource =
    lead.formType === 'quiz'
      ? 'Квіз-калькулятор'
      : lead.formType === 'quick_calc'
      ? 'Швидкий розрахунок'
      : 'Контактна форма'

  const commentParts = [
    `Джерело: ${formSource}`,
    `Телефон: ${contact}`,
    route ? `Маршрут: ${route}` : '',
    cargo ? `Вантаж: ${cargo}` : '',
    lead.weight || lead.volume
      ? `Вага/Обсяг: ${lead.weight || '-'}т / ${lead.volume || '-'}м3`
      : '',
    lead.extras?.length ? `Послуги: ${lead.extras.map(stripEmojis).join(', ')}` : '',
    lead.comment ? `Коментар: ${stripEmojis(lead.comment)}` : '',
    lead.lang ? `Мова: ${lead.lang}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const dealTitle = `Заявка: ${route || cargo || 'Логістика'} (${contact})`

  // Відправка в Bitrix24 через URLSearchParams — гарантовано без CORS проблем (server-side)
  const dealParams = new URLSearchParams({
    'fields[TITLE]': dealTitle,
    'fields[STAGE_ID]': 'NEW',
    'fields[CATEGORY_ID]': '0',
    'fields[ASSIGNED_BY_ID]': '1',
    'fields[COMMENTS]': commentParts,
    'fields[SOURCE_ID]': 'WEB',
    'fields[OPENED]': 'Y',
  })

  try {
    const b24Res = await fetch(`${BITRIX24_WEBHOOK}crm.deal.add.json`, {
      method: 'POST',
      body: dealParams,
    })

    const b24Data = await b24Res.json()

    console.log('[api/lead] Bitrix24 response:', JSON.stringify(b24Data))

    return res.status(200).json({
      success: true,
      bitrixDealId: b24Data.result ?? null,
      bitrixRaw: b24Data,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error'
    console.error('[api/lead] Error:', errorMsg)
    return res.status(500).json({ success: false, error: errorMsg })
  }
}
