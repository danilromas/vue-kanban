const fmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function formatDate(iso) {
  if (!iso) return ''
  return fmt.format(new Date(iso))
}

// сколько дней до дедлайна (отрицательное — просрочено)
export function daysLeft(iso) {
  if (!iso) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  return Math.round((d - today) / 86400000)
}
