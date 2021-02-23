<template>
  <q-page class="q-pa-lg">
    <module parent="Ports" icon="donut_large" name="Port Scanning">
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
              clearable
              label="IP addresses, networks, etc."
              v-model="target"
              :hint="targetHint"
              lazy-rules
              :rules="[(val) => !!val || '* Required']"
            >
            </q-input>
          </q-form>
          <q-input
            outlined
            label="TCP Port ranges"
            v-model="ports_tcp"
            :hint="portsHint"
          >
          </q-input>
          <q-input outlined label="UDP Port ranges" v-model="ports_udp" />
        </q-card-section>
        <q-card-section>
          <q-slide-transition appear>
            <div v-show="show_advanced" class="q-gutter-y-md">
              <q-input
                outlined
                label="Arguments for nmap"
                v-model="nmap_args"
              ></q-input>
              <q-input
                outlined
                label="Arguments for masscan"
                v-model="masscan_args"
              ></q-input>
              <q-input
                outlined
                label="Arguments for naabu"
                v-model="naabu_args"
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
    <scan-res
      parent="Ports"
      icon="donut_large"
      type="port"
      :options="options"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
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
    scanRes,
  },
  setup() {
    const targetHint = 'e.g. 192.168.0.1/24'
    const portsHint = 'e.g. 22; 1-65535; 21-25,80,139,8080'
    const ports_tcp = ref(
      '21,22,80,81,88,135,443,445,3000,3306,3389,4443,5000,7001,8000,8080,8081,8088,8443,8888,9000,9200'
    )
    const ports_udp = ref('137,161,1900,5353')
    const nmap_args = ref('')
    const masscan_args = ref('')
    const naabu_args = ref('')

    const {
      options,
      target,
      project_id,
      show_advanced,
      form,
      formSubmit,
    } = useScan(useStore(), useRoute())

    const table = useTable(api, 'Ports')
    const { project_id_filter, getScans } = table

    async function scan() {
      const code = await api.scanPort(
        project_id.value,
        target.value,
        ports_tcp.value,
        ports_udp.value,
        nmap_args.value,
        masscan_args.value,
        naabu_args.value
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
      ports_tcp,
      ports_udp,
      nmap_args,
      masscan_args,
      naabu_args,
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
