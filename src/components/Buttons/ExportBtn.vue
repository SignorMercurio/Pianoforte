<template>
  <q-btn push color="green" icon="file_download">
    <q-tooltip>Export</q-tooltip>
    <q-menu transition-show="jump-down" transition-hide="jump-up">
      <q-list>
        <q-item
          clickable
          v-close-popup
          v-for="(op, index) in ops"
          :key="index"
          @click="export_all(op)"
        >
          <q-item-section>
            {{ op.toUpperCase() }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MainApi } from 'components/axios'
import { exportFile } from 'quasar'
import { fail } from 'components/utils'

const api = MainApi.getInstance()

export default defineComponent({
  name: 'exportBtn',
  props: {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const ops = ['json', 'csv', 'xlsx']
    const { type, id } = props
    async function export_all(op: string) {
      const blob = await api.getExport(type, id, op)
      const status = exportFile(`${type}_${id}.${op}`, blob)
      if (!status) {
        fail('Download failed...')
      }
    }

    return {
      ops,
      export_all,
    }
  },
})
</script>
