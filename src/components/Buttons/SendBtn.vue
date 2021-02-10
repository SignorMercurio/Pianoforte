<template>
  <q-btn flat color="info" icon="forward">
    <q-tooltip>Send to</q-tooltip>
    <q-menu
      transition-show="jump-down"
      transition-hide="jump-up"
      style="min-width: 250px"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          v-for="(op, index) in ops"
          :key="index"
          @click="send(op.to, op.target)"
        >
          <q-item-section>
            {{ `Send ${op.from} -> ${op.to}` }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'sendBtn',
  props: {
    ops: {
      type: Array,
      required: true,
    },
    project_id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()

    function send(to: string, target: string) {
      router.push({
        name: to,
        params: {
          project_id: props.project_id,
          target: target,
        },
      })
    }

    return {
      send,
    }
  },
})
</script>
