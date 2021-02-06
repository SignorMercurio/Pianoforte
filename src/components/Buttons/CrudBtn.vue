<template>
  <q-btn flat :icon="icon" :color="color" :to="to">
    <q-tooltip>{{ tip }}</q-tooltip></q-btn
  >
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'crudBtn',
  props: {
    to: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'edit',
    },
  },
  setup(props) {
    const icon = ref('create')
    const color = ref('primary')
    const tip = ref('Edit')
    onMounted(() => {
      if (props.type === 'info') {
        icon.value = 'more_horiz'
        color.value = 'info'
        tip.value = 'Detail'
      } else if (props.type === 'del') {
        icon.value = 'delete'
        color.value = 'negative'
        tip.value = 'Delete'
      }
    })

    return {
      icon,
      color,
      tip,
    }
  },
})
</script>
