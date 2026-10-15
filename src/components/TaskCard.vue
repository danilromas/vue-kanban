<script setup>
import { computed, ref } from 'vue'
import { formatDate, daysLeft } from '../utils/date'

const props = defineProps({ card: { type: Object, required: true } })

const dragging = ref(false)
const labels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }

const deadline = computed(() => {
  const d = daysLeft(props.card.deadline)
  if (d === null) return null
  if (props.card.columnId === 'done') return { text: formatDate(props.card.deadline), cls: '' }
  if (d < 0) return { text: 'просрочено', cls: 'late' }
  if (d === 0) return { text: 'сегодня', cls: 'soon' }
  if (d <= 2) return { text: `через ${d} дн.`, cls: 'soon' }
  return { text: formatDate(props.card.deadline), cls: '' }
})

function onDragStart(e) {
  e.dataTransfer.setData('text/card-id', props.card.id)
  e.dataTransfer.effectAllowed = 'move'
  dragging.value = true
}
</script>

<template>
  <article
    class="card"
    :class="{ dragging, done: card.columnId === 'done' }"
    :data-card-id="card.id"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="dragging = false"
  >
    <div class="card-top">
      <span class="prio" :class="card.priority">{{ labels[card.priority] }}</span>
      <span v-if="card.tag" class="tag">#{{ card.tag }}</span>
    </div>
    <h3>{{ card.title }}</h3>
    <p v-if="card.description" class="desc">{{ card.description }}</p>
    <footer v-if="deadline" class="deadline" :class="deadline.cls">⏱ {{ deadline.text }}</footer>
  </article>
</template>
