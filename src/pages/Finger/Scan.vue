<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Fingerprints">
      <template v-slot:card>
        <q-card-section>
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="tool" :props="props">
                  {{ props.row.tool }}
                </q-td>
                <q-td
                  key="finger"
                  :props="props"
                  @click="copy(props.row.finger)"
                >
                  {{ props.row.finger }}
                  <q-tooltip v-if="props.row.finger">{{
                    props.row.finger
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn
                    type="del"
                    @click="del('finger', props.row.id, getFingers)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <export-btn :id="scan.id" type="fingers" />
          <action-btn icon="update" tip="Refresh" @click="getFingers" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all('finger', scan.id, getFingers)"
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
import { Finger, col } from 'src/models/finger'
import { Scan } from 'src/models/scan'
import { del, del_all, copy } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Finger[]>([])
  const getFingers = async () => {
    loading.value = true
    rows.value = await api.getFingers(scan_id)
    loading.value = false
  }

  onMounted(getFingers)

  return {
    loading,
    pagination,
    columns,
    rows,
    getFingers,
  }
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
    return { scan, ...useTable(scan.id), del, del_all, copy }
  },
})
</script>
