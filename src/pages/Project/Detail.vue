<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section> </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { MainApi } from 'components/axios'

const api = MainApi.getInstance()

function useForm() {
  // ..

  return {}
}

export default defineComponent({
  setup(_, { root }) {
    const project_id = parseInt(root.$route.query.id as string)
    onMounted(async () => {
      const project = await api.getProject(project_id)
      console.log(project)
    })
    return { ...useForm() }
  }
})
</script>
