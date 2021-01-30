<template>
  <q-page class="q-pa-lg">
    <module parent="Ports" icon="donut_large" name="Scanning">
      <template v-slot:card>
        <q-card-section class="q-gutter-y-md">
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
              label="Target hostnames, IP addresses, networks, etc."
              v-model="target"
              :hint="targetHint"
              lazy-rules
              :rules="[val => !!val || '* Required']"
            >
            </q-input>
          </q-form>
          <q-input
            outlined
            label="Port ranges"
            v-model="ports"
            :hint="portsHint"
            lazy-rules
            :rules="[val => !!val || 'Required *']"
          >
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-slide-transition appear>
            <div v-show="show_advanced">
              <q-input
                outlined
                label="Command Line Arguments"
                v-model="args"
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
    <scan-res parent="Ports" icon="donut_large" :options="options" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import scanRes from 'components/ScanRes.vue'
import { useScan, useTable } from 'src/models/scan'
import { success } from 'components/utils'

const api = MainApi.getInstance()

export default defineComponent({
  components: {
    module,
    actionBtn,
    scanRes
  },
  setup(_, { root }) {
    const store = root.$store
    const targetHint =
      'e.g. scanme.nmap.org; microsoft.com/24; 192.168.0.1; 10.0.0-255.1-254'
    const portsHint = 'e.g. 22; 1-65535; U:53,111,137,T:21-25,80,139,8080,S:9'
    const ports = ref(
      '21,22,80,81,88,443,445,3000,3306,3389,4443,5000,7001,8000,8080,8081,8088,8443,8888,9000,9200,U:137,161,1900,5353'
    )
    const {
      options,
      target,
      project_id,
      show_advanced,
      args,
      form,
      formSubmit
    } = useScan(store)
    const table = useTable(api, 'Port')
    const { project_id_filter, getScans } = table

    async function scan() {
      const code = await api.scanPort(
        project_id.value,
        target.value,
        ports.value,
        args.value
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
      portsHint,
      ports,
      options,
      target,
      project_id,
      show_advanced,
      form,
      formSubmit,
      scan
    }
  }
})
</script>
