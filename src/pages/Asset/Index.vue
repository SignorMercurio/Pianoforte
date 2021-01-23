<template>
  <q-page class="q-pa-lg">
    <module parent="Assets" icon="web_asset" name="Scanning">
      <template v-slot:card>
        <q-card-section class="row q-gutter-x-sm items-start">
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
            v-model="cidr"
            :hint="hint"
          >
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn push color="primary" icon="find_in_page" @click="scan"></q-btn>
        </q-card-actions>
      </template>
    </module>
    <module parent="Assets" icon="web_asset" name="List">
      <template v-slot:card>
        <q-card-section>
          <q-table
            :data="data"
            :columns="columns"
            row-key="id"
            :pagination.sync="pagination"
            :loading="loading"
          >
            <template v-slot:top>
              <q-select
                class="col-2"
                outlined
                option-label="name"
                option-value="id"
                label="Project"
                :options="options"
                v-model="project_id_filter"
                emit-value
                map-options
                @input="getAssets"
              ></q-select>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search"
                v-model="keyword_filter"
                debounce="300"
                @input="getAssets"
              >
                <template v-slot:prepend>
                  <q-icon name="search"></q-icon>
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="ip" :props="props">
                  {{ props.row.ip }}
                </q-td>
                <q-td key="port" :props="props"
                  ><q-chip square size="sm" color="primary">{{
                    props.row.port
                  }}</q-chip></q-td
                >
                <q-td key="url" :props="props">
                  <q-btn
                    size="sm"
                    color="blue"
                    :label="props.row.url"
                    no-caps
                    flat
                    dense
                    type="a"
                    :href="props.row.url"
                    target="_blank"
                  ></q-btn>
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="status" :props="props"
                  ><q-chip size="sm" :color="status2color(props.row.status)">{{
                    props.row.status
                  }}</q-chip></q-td
                >
                <q-td key="service" :props="props">
                  {{ props.row.service }}
                </q-td>
                <q-td key="domain" :props="props">
                  {{ props.row.domain }}
                </q-td>
                <q-td key="vendor" :props="props">
                  {{ props.row.vendor }}
                </q-td>
                <q-td key="op" :props="props">
                  <q-btn
                    flat
                    icon="delete"
                    color="negative"
                    @click="del(props.row.id)"
                  ></q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn push color="primary" icon="update" @click="getAssets"></q-btn>
          <q-btn
            push
            color="negative"
            icon="delete_sweep"
            @click="del_all"
          ></q-btn>
        </q-card-actions>
      </template>
    </module>
    <!-- <q-dialog v-model="dialog">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">Edit Asset</div>
        </q-card-section>
        <q-card-section>
          <q-input
            dense
            label="Project Name"
            v-model="curProject.name"
            lazy-rules
            :rules="[val => !!val || '* Required']"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-primary"
            flat
            label="OK"
            v-close-popup
            @click="submit"
          ></q-btn>
          <q-btn
            class="text-negative"
            flat
            label="Cancel"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import { Asset } from 'src/models/asset'
import { Dialog } from 'quasar'
import { Project } from 'src/models/project'
import { success } from 'src/components/utils'

const api = MainApi.getInstance()

function useScan() {
  const options = ref<Project[]>([])
  const getOptions = async () => {
    options.value = await api.getProjects()
  }

  onMounted(getOptions)

  const cidr = ref('')
  const project_id = ref(1)

  async function scan() {
    api.scanAsset(project_id.value, cidr.value)
    success('Scanning task submitted')
  }

  return { options, getOptions, cidr, project_id, scan }
}

function useTable() {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref([
    {
      name: 'id',
      label: 'ID',
      align: 'left',
      field: 'id',
      sortable: true
    },
    {
      name: 'ip',
      label: 'IP',
      align: 'left',
      field: 'ip',
      sortable: true
    },
    {
      name: 'port',
      label: 'Port',
      align: 'left',
      field: 'port',
      sortable: true
    },
    {
      name: 'url',
      label: 'URL',
      align: 'left',
      field: 'url',
      sortable: true
    },
    {
      name: 'name',
      label: 'Title',
      align: 'left',
      field: 'name',
      sortable: true
    },
    {
      name: 'status',
      label: 'Status',
      align: 'left',
      field: 'status',
      sortable: true
    },
    {
      name: 'service',
      label: 'Service',
      align: 'left',
      field: 'service',
      sortable: true
    },
    {
      name: 'domain',
      label: 'Domain',
      align: 'left',
      field: 'domain',
      sortable: true
    },
    {
      name: 'vendor',
      label: 'Vendor',
      align: 'left',
      field: 'vendor',
      sortable: true
    },
    {
      name: 'op',
      label: 'Operations',
      align: 'right'
    }
  ])
  const data = ref<Asset[]>([])
  const project_id_filter = ref(1)
  const keyword_filter = ref('')
  const getAssets = async () => {
    loading.value = true
    data.value = await api.getAssets(
      project_id_filter.value,
      keyword_filter.value
    )
    loading.value = false
  }

  onMounted(getAssets)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this asset?'
    }).onOk(() => {
      api.deleteAsset(id).then(getAssets)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all assets of this project?'
    }).onOk(() => {
      api.deleteAssetAll(project_id_filter.value).then(getAssets)
    })
  }

  function status2color(status: number) {
    if (status < 200) return 'accent'
    else if (status < 300) return 'green'
    else if (status < 400) return 'teal'
    else if (status < 500) return 'orange'
    else return 'red'
  }

  return {
    loading,
    pagination,
    columns,
    data,
    project_id_filter,
    keyword_filter,
    getAssets,
    del,
    del_all,
    status2color
  }
}

export default defineComponent({
  components: {
    module
  },
  setup() {
    const hint =
      'e.g. scanme.nmap.org; microsoft.com/24; 192.168.0.1; 10.0.0-255.1-254'
    return { hint, ...useScan(), ...useTable() }
  }
})
</script>
