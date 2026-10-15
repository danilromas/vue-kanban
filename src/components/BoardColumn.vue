<script setup>
import { computed, ref } from 'vue'
import { useBoardStore } from '../stores/board'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  column: { type: Object, required: true },
  filters: { type: Object, required: true },
})
const emit = defineEmits(['add', 'edit'])

const board = useBoardStore()
const isOver = ref(false)
const dropBefore = ref(null) // id карточки, перед которой покажем плейсхолдер
const renaming = ref(false)
const title = ref(props.column.title)

const cards = computed(() =>
  board.cardsIn(props.column.id).filter((c) => {
    const { search, priority } = props.filters
    if (priority !== 'all' && c.priority !== priority) return false
    if (search && !`${c.title} ${c.description} ${c.tag}`.toLowerCase().includes(search)) return false
    return true
  }),
)

function onDragOver(e) {
  isOver.value = true
  // ищем карточку, над верхней половиной которой сейчас курсор
  const els = [...e.currentTarget.querySelectorAll('[data-card-id]')]
  const target = els.find((el) => {
    const r = el.getBoundingClientRect()
    return e.clientY < r.top + r.height / 2
  })
  dropBefore.value = target ? target.dataset.cardId : null
}

function onDrop(e) {
  const id = e.dataTransfer.getData('text/card-id')
  if (id) board.moveCard(id, props.column.id, dropBefore.value)
  isOver.value = false
  dropBefore.value = null
}

function onLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isOver.value = false
    dropBefore.value = null
  }
}

function saveTitle() {
  board.renameColumn(props.column.id, title.value)
  title.value = props.column.title
  renaming.value = false
}

function removeColumn() {
  if (confirm(`Удалить колонку «${props.column.title}» вместе с задачами?`)) board.removeColumn(props.column.id)
}
</script>

<template>
  <section
    class="column"
    :class="{ over: isOver }"
    :style="{ '--accent': column.color }"
    @dragover.prevent="onDragOver"
    @dragleave="onLeave"
    @drop.prevent="onDrop"
  >
    <header class="column-head">
      <span class="dot" />
      <input v-if="renaming" v-model="title" class="rename" autofocus @blur="saveTitle" @keydown.enter="saveTitle" />
      <h2 v-else @dblclick="renaming = true">{{ column.title }}</h2>
      <span class="count">{{ cards.length }}</span>
      <button class="icon-btn" title="Удалить колонку" @click="removeColumn">×</button>
    </header>

    <div class="cards">
      <template v-for="card in cards" :key="card.id">
        <div v-if="isOver && dropBefore === card.id" class="placeholder" />
        <TaskCard :card="card" @click="emit('edit', card)" />
      </template>
      <div v-if="isOver && !dropBefore" class="placeholder" />
      <p v-if="!cards.length && !isOver" class="empty">Пусто</p>
    </div>

    <button class="add-card" @click="emit('add', column.id)">+ Добавить задачу</button>
  </section>
</template>
