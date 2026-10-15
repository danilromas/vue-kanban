<script setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ card: { type: Object, default: null } })
const emit = defineEmits(['close', 'save', 'remove'])

const form = reactive({
  title: props.card?.title ?? '',
  description: props.card?.description ?? '',
  priority: props.card?.priority ?? 'medium',
  tag: props.card?.tag ?? '',
  deadline: props.card?.deadline ?? '',
})

function submit() {
  if (!form.title.trim()) return
  emit('save', { ...form, title: form.title.trim(), tag: form.tag.trim().replace(/^#/, '') })
}

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="overlay" @mousedown.self="emit('close')">
    <form class="modal" @submit.prevent="submit">
      <h2>{{ card ? 'Редактировать задачу' : 'Новая задача' }}</h2>

      <label>
        Название
        <input v-model="form.title" class="input" required autofocus maxlength="80" />
      </label>
      <label>
        Описание
        <textarea v-model="form.description" class="input" rows="3" />
      </label>
      <div class="row">
        <label>
          Приоритет
          <select v-model="form.priority" class="input">
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </label>
        <label>
          Тег
          <input v-model="form.tag" class="input" placeholder="вёрстка" />
        </label>
        <label>
          Дедлайн
          <input v-model="form.deadline" class="input" type="date" />
        </label>
      </div>

      <div class="modal-actions">
        <button v-if="card" type="button" class="btn danger" @click="emit('remove')">Удалить</button>
        <span class="spacer" />
        <button type="button" class="btn ghost" @click="emit('close')">Отмена</button>
        <button type="submit" class="btn primary">Сохранить</button>
      </div>
    </form>
  </div>
</template>
