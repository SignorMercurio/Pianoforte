<template>
  <q-card class="col-3">
    <q-card-section class="row q-gutter-x-sm">
      <q-icon size="md" :name="icon"></q-icon>
    </q-card-section>
    <q-card-section>
      <div class="text-h4 text-primary">
        {{ num }}
      </div></q-card-section
    >
    <q-card-section>
      <div class="text-h6">{{ type }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'cnt',
  props: {
    icon: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    num: {
      type: Number,
      required: true,
    },
  },
})
</script>
