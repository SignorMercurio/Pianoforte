<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="logo.png" />
          </q-avatar>
          Pianoforte
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>
