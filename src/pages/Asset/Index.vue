<template>
  <q-page class="q-pa-lg">
    <module parent="Assets" icon="web" name="Asset Discovery">
      <template v-slot:card>
        <q-card-section>
          <q-form
            ref="form"
            @submit="scan"
            class="row q-gutter-x-md items-start"
          >
            <q-select
              class="col-2"
              outlined
              option-label="name"
              option-value="id"
              label="Project"
              :options="options"
              v-model="project_id"
              emit-value
              map-options
            ></q-select>
            <q-input
              class="col-6"
              outlined
              clearable
              label="IP addresses, networks, etc."
              v-model="target"
              :hint="targetHint"
              lazy-rules
              :rules="[(val) => !!val || '* Required']"
            >
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-slide-transition appear>
            <div v-show="show_advanced">
              <q-input
                outlined
                label="Arguments for httpx"
                v-model="httpx_args"
              ></q-input>
            </div>
          </q-slide-transition>
        </q-card-section>

        <q-card-actions align="right">
          <action-btn
            color="orange"
            icon="settings"
            tip="Advanced Settings"
            @click="show_advanced = !show_advanced"
          />
          <action-btn icon="find_in_page" tip="Scan" @click="formSubmit" />
        </q-card-actions>
      </template>
    </module>
    <scan-res parent="Assets" icon="web" type="asset" :options="options" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import module from 'components/Module.vue'
import actionBtn from 'src/components/Buttons/ActionBtn.vue'
import scanRes from 'components/ScanRes.vue'
import { MainApi } from 'components/axios'
import { useScan, useTable } from 'src/models/scan'
import { success } from 'components/utils'

const api = MainApi.getInstance()

export default defineComponent({
  components: {
    module,
    actionBtn,
    scanRes,
  },
  setup() {
    const targetHint = 'e.g. 192.168.0.1/24'
    const httpx_args = ref('')

    const {
      options,
      target,
      project_id,
      show_advanced,
      form,
      formSubmit,
    } = useScan(useStore(), useRoute())
    const table = useTable(api, 'Assets')
    const { project_id_filter, getScans } = table

    async function scan() {
      const code = await api.scanAsset(
        project_id.value,
        target.value,
        httpx_args.value
      )
      if (code) {
        success(`Scanning task #${code} submitted`)
        project_id_filter.value = project_id.value
        getScans()
      }
    }

    Object.keys(table).forEach((key: string) => {
      provide(key, (table as any)[key])
    })

    return {
      targetHint,
      httpx_args,
      options,
      target,
      project_id,
      show_advanced,
      form,
      formSubmit,
      scan,
    }
  },
})
</script>
