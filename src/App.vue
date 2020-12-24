<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  setup(props, { root }) {
    const store = sessionStorage.getItem('store')
    if (store) {
      root.$store.replaceState(
        Object.assign({}, root.$store.state, JSON.parse(store))
      )
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(root.$store.state))
    })
  }
})
</script>
