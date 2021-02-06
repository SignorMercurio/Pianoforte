<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore()

    const storeItem = sessionStorage.getItem('store')
    if (storeItem) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(storeItem)))
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(store.state))
    })
  },
})
</script>
