const KEY = 'kanban-board-v1'

export function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveBoard(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // если хранилище недоступно (приватный режим) — просто не сохраняем
  }
}
