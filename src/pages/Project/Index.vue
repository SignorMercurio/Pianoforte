<template>
  <q-page class="q-pa-lg">
    <module parent="Projects" icon="format_list_numbered" name="List">
      <template v-slot:card>
        <q-card-section>
          <q-list>
            <q-item clickable v-ripple v-for="item in projects" :key="item.id">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="double_arrow" color="primary"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" icon="add" label="New"></q-btn>
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watchEffect
} from '@vue/composition-api'
import { MainApi } from 'components/axios'
import { success } from 'src/components/utils'
import module from 'components/Module.vue'

const api = MainApi.getInstance()

function useList() {
  //const newDialog = ref(false)
  const projects = ref({})

  watchEffect(async () => {
    projects.value = await api.getProjects()
  })

  return { projects }
}

export default defineComponent({
  components: {
    module
  },
  setup() {
    onMounted(async () => {
      //
    })
    return { ...useList() }
  }
})
</script>
