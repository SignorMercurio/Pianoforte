<template>
  <div>
    <q-breadcrumbs>
      <q-breadcrumbs-el :label="parent" :icon="icon"></q-breadcrumbs-el>
      <q-breadcrumbs-el :label="name"></q-breadcrumbs-el>
      <q-btn
        flat
        dense
        :icon="fold ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
        @click="fold = !fold"
      ></q-btn>
    </q-breadcrumbs>
    <q-slide-transition appear>
      <div v-show="!fold">
        <q-card class="q-mt-md q-mb-lg q-pa-sm">
          <slot name="card"></slot>
        </q-card>
      </div>
    </q-slide-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    parent: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    name: {
      type: String,
      required: true
    }
  },
  setup() {
    const fold = ref(false)
    return { fold }
  }
})
</script>
