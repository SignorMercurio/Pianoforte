<template>
  <q-td
    key="title"
    @click="copy(value)"
    style="max-width: 150px"
    class="ellipsis"
  >
    {{ value }}
    <q-tooltip v-if="value">{{ value }}</q-tooltip>
  </q-td>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { copy } from '../utils'

export default defineComponent({
  name: 'tdLong',
  props: {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { copy }
  },
})
</script>
