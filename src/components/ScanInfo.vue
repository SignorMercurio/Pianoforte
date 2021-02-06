<template>
  <module parent="Scan" icon="find_in_page" name="Information">
    <template v-slot:card>
      <q-list padding>
        <q-item>
          <q-item-section>
            <q-item-label>Project</q-item-label>
            <q-item-label caption>{{ scan.project.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Type</q-item-label>
            <q-item-label caption>{{ scan.type }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Target</q-item-label>
            <q-item-label caption>{{ scan.target }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Created at</q-item-label>
            <q-item-label caption>{{ fmtTime(scan.created_at) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Status</q-item-label>
            <q-item-label caption>
              <q-chip :color="str2color(scan.status)" size="sm">{{
                scan.status
              }}</q-chip></q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </module>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import module from './Module.vue'
import { Project } from 'src/models/project'
import { str2color, fmtTime } from './utils'

export default defineComponent({
  name: 'scanInfo',
  components: {
    module,
  },
  props: {
    scan: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore()
    const projects = store.getters['project/getProjects'] as Project[]
    return { projects, str2color, fmtTime }
  },
})
</script>
