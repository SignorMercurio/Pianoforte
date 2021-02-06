<template>
  <q-page class="q-pa-lg">
    <scan-res
      parent="Vulnerabilities"
      icon="bug_report"
      type="vuln"
      :options="options"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { useStore } from 'vuex'
import { Project } from 'src/models/project'
import scanRes from 'components/ScanRes.vue'
import { MainApi } from 'components/axios'
import { useTable } from 'src/models/scan'

const api = MainApi.getInstance()

export default defineComponent({
  components: {
    scanRes,
  },
  setup() {
    const store = useStore()
    const options = ref<Project[]>(store.getters['project/getProjects'])
    const table = useTable(api, 'Vulnerabilities')

    Object.keys(table).forEach((key: string) => {
      provide(key, (table as any)[key])
    })

    return {
      options,
    }
  },
})
</script>
