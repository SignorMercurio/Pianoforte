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
                <q-td key="op" :props="props">
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
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import chart from 'components/Chart.vue'
import { Port, col } from 'src/models/port'
import { Scan } from 'src/models/scan'
import { del, del_all, protocol2color, copy } from 'components/utils'

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

export default defineComponent({
  components: {
    module,
    crudBtn,
    actionBtn,
    scanInfo,
    chart,
  },
  setup() {
    const scan = JSON.parse(sessionStorage.getItem('scan') as string) as Scan
    return {
      scan,
      ...useTable(scan.id),
      del,
      del_all,
      protocol2color,
      copy,
    }
  },
})
</script>
