<template>
  <q-page class="q-pa-lg">
    <module parent="Settings" icon="settings" name="Network">
      <template v-slot:card>
        <q-card-section> </q-card-section>
      </template>
    </module>
    <module parent="Settings" icon="settings" name="Tools">
      <template v-slot:card>
        <q-card-section> </q-card-section>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import module from 'components/Module.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import { MainApi } from 'components/axios'
import { success } from 'src/components/utils'

const api = MainApi.getInstance()

export default defineComponent({
  components: {
    module,
    actionBtn
  },
  setup() {
    return {}
  }
})
</script>
