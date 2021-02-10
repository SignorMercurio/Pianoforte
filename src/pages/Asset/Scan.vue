<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />
    <chart :id="scan.id" type="assets" a-name="HTTP Status" b-name="Port" />

    <module parent="Scan" icon="find_in_page" name="Assets">
      <template v-slot:card>
        <q-card-section>
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
          >
            <template v-slot:top-right>
              <q-input
                class="col-3"
                outlined
                label="Search URL"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getAssets"
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
                <q-td key="name" :props="props" @click="copy(props.row.name)">
                  {{ props.row.name }}
                  <q-tooltip v-if="props.row.name">{{
                    props.row.name
                  }}</q-tooltip>
                </q-td>
                <q-td key="status" :props="props"
                  ><q-chip
                    v-if="props.row.status"
                    size="sm"
                    :color="status2color(props.row.status)"
                    >{{ props.row.status }}</q-chip
                  ></q-td
                >
                <q-td
                  key="service"
                  :props="props"
                  @click="copy(props.row.service)"
                >
                  {{ props.row.service }}
                  <q-tooltip v-if="props.row.service">{{
                    props.row.service
                  }}</q-tooltip>
                </q-td>
                <!-- <q-td key="domain" :props="props">
                  {{ props.row.domain }}
                </q-td> -->
                <q-td
                  key="vendor"
                  :props="props"
                  @click="copy(props.row.vendor)"
                >
                  {{ props.row.vendor }}
                  <q-tooltip v-if="props.row.vendor">{{
                    props.row.vendor
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <send-btn
                    :project_id="scan.project.id"
                    :ops="getOps(props.row)"
                  />
                  <crud-btn
                    type="del"
                    @click="del('asset', props.row.id, getAssets)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <export-btn :id="scan.id" type="assets" />
          <action-btn
            color="info"
            icon="forward"
            tip="Send to Port Scanning"
            @click="send2port"
          />
          <action-btn icon="update" tip="Refresh" @click="getAssets" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all('asset', scan.id, getAssets)"
          />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import sendBtn from 'components/Buttons/SendBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import exportBtn from 'components/Buttons/ExportBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import chart from 'components/Chart.vue'
import { Asset, col } from 'src/models/asset'
import { Scan } from 'src/models/scan'
import { del, del_all, status2color, copy } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Asset[]>([])
  const keyword_filter = ref('')
  const getAssets = async () => {
    loading.value = true
    rows.value = await api.getAssets(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getAssets)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    getAssets,
  }
}

function useSend(scan: Scan, router: any) {
  const { project, target } = scan

  function send2port() {
    router.push({
      name: 'Ports',
      params: {
        project_id: project.id,
        target,
      },
    })
  }

  function getOps(row: Asset) {
    return [
      {
        from: 'IP',
        to: 'Ports',
        target: row.ip,
      },
      {
        from: 'URL',
        to: 'Directories',
        target: row.url,
      },
      {
        from: 'URL',
        to: 'Fingerprints',
        target: row.url,
      },
      {
        from: 'URL',
        to: 'Endpoints',
        target: row.url,
      },
    ]
  }

  return {
    send2port,
    getOps,
  }
}

export default defineComponent({
  components: {
    module,
    crudBtn,
    sendBtn,
    actionBtn,
    exportBtn,
    scanInfo,
    chart,
  },
  setup() {
    const router = useRouter()
    const scan = JSON.parse(sessionStorage.getItem('scan') as string) as Scan
    return {
      scan,
      ...useTable(scan.id),
      ...useSend(scan, router),
      del,
      del_all,
      status2color,
      copy,
    }
  },
})
</script>
