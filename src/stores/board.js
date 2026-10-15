import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadBoard, saveBoard } from '../utils/storage'

const uid = () => Math.random().toString(36).slice(2, 9)

const defaultColumns = [
  { id: 'todo', title: 'Нужно сделать', color: '#7aa2f7' },
  { id: 'progress', title: 'В работе', color: '#e0af68' },
  { id: 'review', title: 'На проверке', color: '#bb9af7' },
  { id: 'done', title: 'Готово', color: '#9ece6a' },
]

const demoCards = [
  { title: 'Сверстать шапку лендинга', priority: 'high', tag: 'вёрстка', columnId: 'progress' },
  { title: 'Подключить API погоды', priority: 'medium', tag: 'api', columnId: 'todo' },
  { title: 'Настроить деплой на Pages', priority: 'low', tag: 'devops', columnId: 'done' },
  { title: 'Ревью формы обратной связи', priority: 'medium', tag: 'ревью', columnId: 'review' },
  { title: 'Адаптив для мобилок', priority: 'high', tag: 'вёрстка', columnId: 'todo' },
].map((c) => ({ id: uid(), description: '', deadline: '', createdAt: new Date().toISOString(), ...c }))

export const useBoardStore = defineStore('board', () => {
  const saved = loadBoard()
  const columns = ref(saved?.columns ?? defaultColumns)
  const cards = ref(saved?.cards ?? demoCards)

  watch([columns, cards], () => saveBoard({ columns: columns.value, cards: cards.value }), { deep: true })

  function cardsIn(columnId) {
    return cards.value.filter((c) => c.columnId === columnId)
  }

  function addCard(columnId, data) {
    cards.value.push({
      id: uid(),
      columnId,
      title: data.title.trim(),
      description: data.description ?? '',
      priority: data.priority ?? 'medium',
      tag: data.tag ?? '',
      deadline: data.deadline ?? '',
      createdAt: new Date().toISOString(),
    })
  }

  function updateCard(id, patch) {
    const card = cards.value.find((c) => c.id === id)
    if (card) Object.assign(card, patch)
  }

  function removeCard(id) {
    cards.value = cards.value.filter((c) => c.id !== id)
  }

  // переносим карточку в колонку и ставим перед карточкой beforeId (или в конец)
  function moveCard(id, columnId, beforeId = null) {
    const from = cards.value.findIndex((c) => c.id === id)
    if (from === -1 || id === beforeId) return
    const [card] = cards.value.splice(from, 1)
    card.columnId = columnId

    let to = beforeId ? cards.value.findIndex((c) => c.id === beforeId) : -1
    if (to === -1) {
      // ставим после последней карточки этой колонки
      const lastIdx = cards.value.findLastIndex((c) => c.columnId === columnId)
      to = lastIdx + 1
    }
    cards.value.splice(to, 0, card)
  }

  function addColumn(title) {
    const colors = ['#7dcfff', '#f7768e', '#73daca', '#ff9e64']
    columns.value.push({ id: uid(), title, color: colors[columns.value.length % colors.length] })
  }

  function renameColumn(id, title) {
    const col = columns.value.find((c) => c.id === id)
    if (col && title.trim()) col.title = title.trim()
  }

  function removeColumn(id) {
    columns.value = columns.value.filter((c) => c.id !== id)
    cards.value = cards.value.filter((c) => c.columnId !== id)
  }

  function reset() {
    columns.value = structuredClone(defaultColumns)
    cards.value = []
  }

  return { columns, cards, cardsIn, addCard, updateCard, removeCard, moveCard, addColumn, renameColumn, removeColumn, reset }
})
