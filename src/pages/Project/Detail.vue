<template>
  <q-page class="q-pa-lg">
    <module parent="Assets" icon="web_asset" name="List"></module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'

const api = MainApi.getInstance()

function useAsset() {
  // ..

  return {}
}

export default defineComponent({
  components: {
    module
  },
  setup(_, { root }) {
    const project_id = parseInt(root.$route.query.id as string)
    // onMounted(async () => {
    //   const project = await api.getProject(project_id)
    //   console.log(project)
    // })
    return { ...useAsset() }
  }
})
</script>
