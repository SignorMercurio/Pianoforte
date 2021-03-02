<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />
    <chart :id="scan.id" type="domains" a-name="HTTP Status" b-name="Level" />

    <module parent="Scan" icon="find_in_page" name="Domains">
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
                label="Search subdomain"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getDomains"
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
                <q-td key="subdomain" :props="props">
                  {{ props.row.subdomain }}
                </q-td>
                <q-td key="level" :props="props">
                  {{ props.row.level }}
                </q-td>
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
                <td-long key="ip" :value="props.row.ip" />
                <td-long key="cname" :value="props.row.cname" />
                <q-td key="status" :props="props">
                  <q-chip
                    v-if="props.row.status"
                    size="sm"
                    :color="status2color(props.row.status)"
                    >{{ props.row.status }}</q-chip
                  >
                </q-td>
                <td-long key="title" :value="props.row.title" />
                <td-long key="server" :value="props.row.server" />
                <q-td key="op" :props="props">
                  <send-btn
                    :project_id="scan.project.id"
                    :ops="getOps(props.row)"
                  />
                  <crud-btn
                    type="del"
                    @click="del('domain', props.row.id, getDomains)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <export-btn :id="scan.id" type="domains" />
          <action-btn icon="update" tip="Refresh" @click="getDomains" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all('domain', scan.id, getDomains)"
          />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import sendBtn from 'components/Buttons/SendBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import exportBtn from 'components/Buttons/ExportBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import chart from 'components/Chart.vue'
import tdLong from 'components/Columns/TdLong.vue'
import { Domain, col } from 'src/models/domain'
import { Scan } from 'src/models/scan'
import { del, del_all, status2color } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Domain[]>([])
  const keyword_filter = ref('')
  const getDomains = async () => {
    loading.value = true
    rows.value = await api.getDomains(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getDomains)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    getDomains,
  }
}

function useSend() {
  function getOps(row: Domain) {
    return [
      {
        from: 'Subdomain',
        to: 'Assets',
        target: row.subdomain,
      },
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
    tdLong,
  },
  setup() {
    const scan = JSON.parse(sessionStorage.getItem('scan') as string) as Scan
    return {
      scan,
      ...useTable(scan.id),
      ...useSend(),
      del,
      del_all,
      status2color,
    }
  },
})
</script>
