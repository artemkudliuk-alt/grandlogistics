/**
 * Утилита аналитики: Google Analytics 4 (GA4) + Meta Pixel
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set' | 'js',
      action: string,
      params?: Record<string, unknown>
    ) => void
    fbq?: (
      command: 'track' | 'trackCustom' | 'init',
      eventName: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

export interface LeadAnalyticsPayload {
  formType: 'contact_form' | 'quick_calc' | 'quiz'
  cargoType?: string
  route?: string
  value?: number
}

/**
 * Отправка события лида в GA4 и Meta Pixel
 */
export function trackLeadEvent(payload: LeadAnalyticsPayload) {
  try {
    // 1. Google Analytics 4 (GA4)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        form_name: payload.formType,
        cargo_type: payload.cargoType || 'Not specified',
        route: payload.route || 'Not specified',
        currency: 'USD',
        value: payload.value || 1,
      })

      // Дополнительное стандартное событие
      window.gtag('event', 'lead_submission', {
        event_category: 'Engagement',
        event_label: payload.formType,
      })
    }

    // 2. Meta (Facebook/Instagram) Pixel
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: payload.formType,
        content_category: payload.cargoType || 'Logistics',
        currency: 'USD',
        value: payload.value || 1,
      })
    }
  } catch (err) {
    console.warn('Analytics tracking error:', err)
  }
}

/**
 * Отправка события прохождения шага квиза
 */
export function trackQuizStep(stepNumber: number, stepName: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'quiz_step_view', {
        step_number: stepNumber,
        step_name: stepName,
      })
    }
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('trackCustom', 'QuizStep', {
        step: stepNumber,
        name: stepName,
      })
    }
  } catch (err) {
    console.warn('Quiz step tracking error:', err)
  }
}

/**
 * Отправка клика по контактам (Telegram, телефон)
 */
export function trackContactClick(method: 'telegram' | 'phone') {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'contact', {
        method: method,
      })
    }
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        method: method,
      })
    }
  } catch (err) {
    console.warn('Contact click tracking error:', err)
  }
}
