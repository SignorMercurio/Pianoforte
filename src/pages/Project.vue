<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import { success } from 'src/components/utils'

const api = MainApi.getInstance()

export default defineComponent({
  setup() {
    onMounted(async () => {
      //
      const projects = await api.getProjects()
      success('getProjects')
      console.log(projects)
    })
    return {}
  }
})
</script>
