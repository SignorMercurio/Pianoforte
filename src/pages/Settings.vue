<template>
  <q-page class="q-pa-lg">
    <module parent="Settings" icon="settings" name="Network">
      <template v-slot:card>
        <q-card-section class="q-gutter-y-md">
          <q-input
            outlined
            label="Request Timeout"
            type="number"
            v-model.number="timeout"
          />
          <q-list bordered class="rounded-borders">
            <q-expansion-item label="Request Headers" icon="http">
              <q-card>
                <q-card-section
                  class="row q-gutter-x-md"
                  v-for="(header, index) in headers"
                  :key="index"
                >
                  <q-input
                    outlined
                    label="Key"
                    class="col-4"
                    v-model="header.key"
                  />
                  <q-input
                    outlined
                    label="Value"
                    class="col-4"
                    v-model="header.value"
                  />
                  <q-space />
                  <q-btn flat color="green" icon="add" @click="addHdr(index)" />
                  <q-btn flat color="red" icon="remove" @click="rmHdr(index)" />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="save" tip="Save" @click="saveNetwork" />
        </q-card-actions>
      </template>
    </module>
    <module parent="Settings" icon="settings" name="Tools">
      <template v-slot:card>
        <q-card-section class="q-gutter-y-md">
          <q-field outlined stack-label label="HTTP(s) ports">
            <template v-slot:control>
              <q-chip
                size="sm"
                v-for="(port, id) in tools.port_http"
                :key="id"
                removable
                @remove="rmPort(id)"
                color="green"
                :label="port"
              />
              <q-btn size="xs" rounded icon="add" color="green">
                <q-popup-edit
                  title="Port"
                  v-model.number="portTmp"
                  :validate="portValidation"
                  @hide="portValidation"
                  @save="addPort"
                  v-slot="scope"
                >
                  <q-input
                    type="number"
                    v-model.number="scope.value"
                    hint="1-65535"
                    :error="errPort"
                    :error-message="errMsgPort"
                    dense
                    @keyup.enter="scope.set"
                  ></q-input>
                </q-popup-edit>
              </q-btn>
            </template>
          </q-field>
          <!-- <q-field dense>
            <template v-slot:control>
              <div class="text-h6">Default Command Line Arguments</div>
            </template>
          </q-field> -->
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              label="Default Command Line Arguments"
              icon="tune"
            >
              <q-expansion-item
                expand-separator
                label="Assets"
                icon="web"
                caption="httpx"
                :header-inset-level="0.5"
                :content-inset-level="0.5"
              >
                <q-card
                  ><q-card-section>
                    <q-input
                      outlined
                      label="httpx"
                      v-model="tools.httpx_args"
                    /> </q-card-section
                ></q-card>
              </q-expansion-item>
              <q-expansion-item
                expand-separator
                label="Domains"
                icon="dns"
                caption="OneForAll, amass, subfinder"
                :header-inset-level="0.5"
                :content-inset-level="0.5"
              >
                <q-card
                  ><q-card-section>
                    <q-input
                      outlined
                      label="OneForAll"
                      v-model="tools.oneforall_args"
                    />
                    <q-input
                      class="q-mt-md"
                      outlined
                      label="amass"
                      v-model="tools.amass_args"
                    />
                    <q-input
                      class="q-mt-md"
                      outlined
                      label="subfinder"
                      v-model="tools.subfinder_args"
                    /> </q-card-section
                ></q-card>
              </q-expansion-item>
              <q-expansion-item
                expand-separator
                label="Ports"
                icon="donut_large"
                caption="nmap, masscan, naabu"
                :header-inset-level="0.5"
                :content-inset-level="0.5"
              >
                <q-card
                  ><q-card-section>
                    <q-input outlined label="Nmap" v-model="tools.nmap_args" />
                    <q-input
                      class="q-mt-md"
                      outlined
                      label="masscan"
                      v-model="tools.masscan_args"
                    />
                    <q-input
                      class="q-mt-md"
                      outlined
                      label="naabu"
                      v-model="tools.naabu_args"
                    /> </q-card-section
                ></q-card>
              </q-expansion-item>
              <q-expansion-item
                expand-separator
                label="Directories"
                icon="folder"
                caption="dirsearch"
                :header-inset-level="0.5"
                :content-inset-level="0.5"
              >
                <q-card
                  ><q-card-section>
                    <q-input
                      outlined
                      label="dirsearch"
                      v-model="tools.dirsearch_args"
                    /> </q-card-section
                ></q-card>
              </q-expansion-item>
              <q-expansion-item
                expand-separator
                label="Fingerprints"
                icon="fingerprint"
                caption="WhatWeb"
                :header-inset-level="0.5"
                :content-inset-level="0.5"
              >
                <q-card
                  ><q-card-section>
                    <q-input
                      outlined
                      label="WhatWeb"
                      v-model="tools.whatweb_args"
                    /> </q-card-section
                ></q-card>
              </q-expansion-item>
              <q-expansion-item
                expand-separator
                label="Endpoints"
                icon="link"
                caption="rad, hakrawler"
                :header-inset-level="0.5"
                :content-inset-level="0.5"
              >
                <q-card
                  ><q-card-section>
                    <q-input outlined label="rad" v-model="tools.rad_args" />
                    <q-input
                      class="q-mt-md"
                      outlined
                      label="hakrawler"
                      v-model="tools.hakrawler_args"
                    /> </q-card-section
                ></q-card>
              </q-expansion-item>
            </q-expansion-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="save" tip="Save" @click="saveTools" />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import module from 'components/Module.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import { Header, Tools } from 'src/models/misc'
import { MainApi } from 'components/axios'
import { success } from 'src/components/utils'

const api = MainApi.getInstance()

function useNetwork() {
  const timeout = ref(0)
  const headers = ref<Header[]>([])
  const getNetwork = async () => {
    timeout.value = await api.getTimeout()
    headers.value = await api.getHeaders()
  }

  onMounted(getNetwork)

  function addHdr(index: number) {
    headers.value.splice(index + 1, 0, {
      key: '',
      value: '',
    })
  }

  function rmHdr(index: number) {
    headers.value.splice(index, 1)
  }

  async function saveNetwork() {
    const code_timeout = await api.setTimeout(timeout.value)
    const code_headers = await api.setHeaders(headers.value)
    if (!code_timeout && !code_headers) {
      success('Saved')
    }
  }

  return {
    timeout,
    headers,
    addHdr,
    rmHdr,
    saveNetwork,
  }
}

function useTools() {
  const tools = ref<Tools>({
    port_http: [] as number[],
    httpx_args: '',
    oneforall_args: '',
    amass_args: '',
    subfinder_args: '',
    nmap_args: '',
    masscan_args: '',
    naabu_args: '',
    dirsearch_args: '',
    whatweb_args: '',
    rad_args: '',
    hakrawler_args: '',
  })
  const portTmp = ref(80)
  const errPort = ref(false)
  const errMsgPort = ref('')

  const getTools = async () => {
    tools.value = await api.getTools()
  }

  onMounted(getTools)

  function addPort(val: number) {
    tools.value.port_http.push(val)
  }

  function portValidation(val: number) {
    if (val < 1 || val > 65535) {
      errPort.value = true
      errMsgPort.value = 'Port must be between 1-65535'
      return false
    }
    errPort.value = false
    errMsgPort.value = ''
    return true
  }

  function rmPort(index: number) {
    tools.value.port_http.splice(index, 1)
  }

  async function saveTools() {
    const code = await api.setTools(tools.value)
    if (code === 0) {
      success('Saved')
    }
  }

  return {
    tools,
    portTmp,
    errPort,
    errMsgPort,
    addPort,
    portValidation,
    rmPort,
    saveTools,
  }
}

export default defineComponent({
  components: {
    module,
    actionBtn,
  },
  setup() {
    return { ...useNetwork(), ...useTools() }
  },
})
</script>
