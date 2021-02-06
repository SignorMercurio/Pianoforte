<template>
  <q-btn push :icon="icon" :color="color">
    <q-tooltip>{{ tip }}</q-tooltip></q-btn
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'actionBtn',
  props: {
    icon: {
      type: String,
      default: 'add',
    },
    color: {
      type: String,
      default: 'primary',
    },
    tip: {
      type: String,
      default: 'New',
    },
  },
  setup() {
    return {}
  },
})
</script>
