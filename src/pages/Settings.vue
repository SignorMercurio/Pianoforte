<template>
  <q-page class="row items-center justify-evenly">
    <module parent="Settings" icon="settings" name="Projects">
      <template v-slot:card>
        <q-card-section> </q-card-section>
      </template>
    </module>
  </q-page>
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
    })
    return {}
  }
})
</script>
