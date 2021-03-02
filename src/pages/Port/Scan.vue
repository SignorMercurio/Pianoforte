<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />
    <chart :id="scan.id" type="ports" a-name="Port" b-name="Protocol" />

    <module parent="Scan" icon="find_in_page" name="Ports">
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
                label="Search IP"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getPorts"
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
                <q-td key="protocol" :props="props">
                  <q-chip
                    sqaure
                    size="sm"
                    :color="protocol2color(props.row.protocol)"
                    >{{ props.row.protocol }}</q-chip
                  >
                </q-td>
                <td-long key="service" :value="props.row.service" />
                <q-td key="op" :props="props">
                  <send-btn
                    :project_id="scan.project.id"
                    :ops="getOps(props.row)"
                  />
                  <crud-btn
                    type="del"
                    @click="del('port', props.row.id, getPorts)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <export-btn :id="scan.id" type="ports" />
          <action-btn
            color="info"
            icon="forward"
            tip="Send to Assets Discovery"
            @click="send2asset"
          />
          <action-btn icon="update" tip="Refresh" @click="getPorts" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all('port', scan.id, getPorts)"
          />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { MainApi } from 'components/axios'
import { useRouter } from 'vue-router'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import sendBtn from 'components/Buttons/SendBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import exportBtn from 'components/Buttons/ExportBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import chart from 'components/Chart.vue'
import tdLong from 'components/Columns/TdLong.vue'
import { Port, col } from 'src/models/port'
import { Scan } from 'src/models/scan'
import { del, del_all, protocol2color } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Port[]>([])
  const keyword_filter = ref('')
  const getPorts = async () => {
    loading.value = true
    rows.value = await api.getPorts(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getPorts)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    getPorts,
  }
}

function useSend(scan: Scan, router: any) {
  const { project, target } = scan

  function send2asset() {
    router.push({
      name: 'Assets',
      params: {
        project_id: project.id,
        target,
      },
    })
  }

  function getOps(row: Port) {
    return [
      {
        from: 'IP',
        to: 'Assets',
        target: row.ip,
      },
    ]
  }

  return { send2asset, getOps }
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
    tdLong,
  },
  setup() {
    const scan = JSON.parse(sessionStorage.getItem('scan') as string) as Scan
    const router = useRouter()

    return {
      scan,
      ...useTable(scan.id),
      ...useSend(scan, router),
      del,
      del_all,
      protocol2color,
    }
  },
})
</script>
