<script setup>
import { computed, ref } from 'vue'
import { useBoardStore } from './stores/board'
import BoardColumn from './components/BoardColumn.vue'
import TaskModal from './components/TaskModal.vue'

const board = useBoardStore()

const search = ref('')
const priority = ref('all')
const editing = ref(null) // { card } или { columnId } для новой карточки

const filters = computed(() => ({ search: search.value.toLowerCase().trim(), priority: priority.value }))

const stats = computed(() => {
  const total = board.cards.length
  const done = board.cards.filter((c) => c.columnId === 'done').length
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
})

function openNew(columnId) {
  editing.value = { columnId }
}

function openEdit(card) {
  editing.value = { card }
}

function save(data) {
  if (editing.value.card) board.updateCard(editing.value.card.id, data)
  else board.addCard(editing.value.columnId, data)
  editing.value = null
}

function remove() {
  board.removeCard(editing.value.card.id)
  editing.value = null
}

function addColumn() {
  const title = prompt('Название колонки')
  if (title?.trim()) board.addColumn(title.trim())
}
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <span class="logo" />
      <div>
        <h1>Доска задач</h1>
        <p class="muted">{{ stats.done }} из {{ stats.total }} готово · {{ stats.percent }}%</p>
      </div>
    </div>

    <div class="progress"><span :style="{ width: stats.percent + '%' }" /></div>

    <div class="controls">
      <input v-model="search" class="input" type="search" placeholder="Поиск по задачам…" />
      <select v-model="priority" class="input">
        <option value="all">Любой приоритет</option>
        <option value="high">Высокий</option>
        <option value="medium">Средний</option>
        <option value="low">Низкий</option>
      </select>
      <button class="btn" @click="addColumn">+ Колонка</button>
    </div>
  </header>

  <main class="board">
    <BoardColumn
      v-for="col in board.columns"
      :key="col.id"
      :column="col"
      :filters="filters"
      @add="openNew"
      @edit="openEdit"
    />
  </main>

  <TaskModal
    v-if="editing"
    :card="editing.card"
    @close="editing = null"
    @save="save"
    @remove="remove"
  />
</template>
