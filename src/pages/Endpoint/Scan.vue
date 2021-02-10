<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Endpoints">
      <template v-slot:card>
        <q-card-section>
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
          >
            <template v-slot:top>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search path"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getEndpoints"
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
                <q-td key="path" :props="props">
                  <q-btn
                    size="sm"
                    color="blue"
                    :label="full2path(scan.target, props.row.path)"
                    no-caps
                    flat
                    dense
                    type="a"
                    :href="props.row.path"
                    target="_blank"
                  />
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn
                    type="del"
                    @click="del('endpoint', props.row.id, getEndpoints)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <export-btn :id="scan.id" type="endpoints" />
          <action-btn
            color="info"
            icon="forward"
            tip="Send to Vulnerability Scanning"
            @click="send2vuln"
          />
          <action-btn icon="update" tip="Refresh" @click="getEndpoints" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all('endpoint', scan.id, getEndpoints)"
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
import actionBtn from 'components/Buttons/ActionBtn.vue'
import exportBtn from 'components/Buttons/ExportBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import { Endpoint, col } from 'src/models/endpoint'
import { Scan } from 'src/models/scan'
import { del, del_all, success, full2path } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Endpoint[]>([])
  const keyword_filter = ref('')
  const getEndpoints = async () => {
    loading.value = true
    rows.value = await api.getEndpoints(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getEndpoints)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    getEndpoints,
  }
}

function useSend(scan: Scan) {
  const { project, target, id } = scan

  async function send2vuln() {
    const code = await api.scanVuln(project.id, target, id)
    if (code) {
      success(`Scanning task #${code} submitted`)
    }
  }

  return { send2vuln }
}

export default defineComponent({
  components: {
    module,
    crudBtn,
    actionBtn,
    exportBtn,
    scanInfo,
  },
  setup() {
    const scan = JSON.parse(sessionStorage.getItem('scan') as string) as Scan

    return {
      scan,
      ...useTable(scan.id),
      ...useSend(scan),
      del,
      del_all,
      full2path,
    }
  },
})
</script>
