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
          <q-field dense>
            <template v-slot:control>
              <div class="text-h6">Request Headers</div>
            </template>
          </q-field>

          <div
            class="row q-gutter-x-md"
            v-for="(header, index) in headers"
            :key="index"
          >
            <q-input outlined label="Key" class="col-4" v-model="header.key" />
            <q-input
              outlined
              label="Value"
              class="col-4"
              v-model="header.value"
            />
            <q-space />
            <q-btn flat color="green" icon="add" @click="addHdr(index)" />
            <q-btn flat color="red" icon="remove" @click="rmHdr(index)" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="save" tip="Save" @click="saveNetwork" />
        </q-card-actions>
      </template>
    </module>
    <module parent="Settings" icon="settings" name="Tools">
      <template v-slot:card>
        <q-card-section class="q-gutter-y-md">
          <q-field outlined stack-label label="HTTP ports">
            <template v-slot:control>
              <q-chip
                size="sm"
                v-for="(port, id) in tools.port_http"
                :key="id"
                removable
                @remove="rmPort(id)"
                color="primary"
                :label="port"
              />
              <q-btn size="xs" rounded icon="add" color="primary">
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
          <q-field outlined stack-label label="HTTPS ports">
            <template v-slot:control>
              <q-chip
                size="sm"
                v-for="(port, id) in tools.port_https"
                :key="id"
                removable
                @remove="rmPorts(id)"
                color="green"
                :label="port"
              />
              <q-btn size="xs" rounded icon="add" color="green">
                <q-popup-edit
                  title="Port"
                  v-model.number="portTmp"
                  :validate="portValidation"
                  @hide="portValidation"
                  @save="addPorts"
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
          <q-field dense>
            <template v-slot:control>
              <div class="text-h6">Default Command Line Arguments</div>
            </template>
          </q-field>
          <q-input outlined label="Assets" v-model="tools.asset_args" />
          <q-input outlined label="Domains" v-model="tools.domain_args" />
          <q-input outlined label="Ports" v-model="tools.port_args" />
          <q-input outlined label="Directories" v-model="tools.dir_args" />
          <q-input outlined label="Fingerprints" v-model="tools.finger_args" />
          <q-input outlined label="Endpoints" v-model="tools.hak_args" />
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
    port_https: [] as number[],
    asset_args: '',
    domain_args: '',
    port_args: '',
    dir_args: '',
    finger_args: '',
    hak_args: '',
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
  function addPorts(val: number) {
    tools.value.port_https.push(val)
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
  function rmPorts(index: number) {
    tools.value.port_https.splice(index, 1)
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
    addPorts,
    portValidation,
    rmPort,
    rmPorts,
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
