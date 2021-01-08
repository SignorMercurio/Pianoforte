<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { NoAuthApi } from 'components/axios'
import { success } from 'components/utils'

export default defineComponent({
  setup() {
    const api = NoAuthApi.getInstance()

    onMounted(() => {
      success('Testing')
      api
        .createUser({
          username: 'test2',
          password: 'test22'
        })
        .then(data => {
          console.log(data)
        })
    })
    return {}
  }
})
</script>
