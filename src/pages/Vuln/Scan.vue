<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Vulnerabilities">
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
              <!-- <q-toggle
                label="Alive Vulns Only"
                v-model="alive_filter"
                @input="getVulns"
              ></q-toggle> -->
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search vulnerability type"
                v-model="keyword_filter"
                debounce="300"
                @input="getVulns"
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
                <q-td key="type" :props="props">
                  {{ props.row.type }}
                </q-td>
                <q-td key="risk" :props="props">
                  <q-chip
                    v-if="props.row.risk"
                    size="sm"
                    :color="status2color(props.row.risk)"
                    >{{ props.row.risk }}</q-chip
                  >
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
                <!-- <q-td key="title" :props="props">
                  {{ props.row.title }}
                  <q-tooltip v-if="props.row.title">{{
                    props.row.title
                  }}</q-tooltip>
                </q-td> -->
                <q-td key="op" :props="props">
                  <crud-btn type="del" @click="del(props.row.id)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="update" tip="Refresh" @click="getVulns" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all"
          />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import { Vuln, col } from 'src/models/vuln'
import { Scan } from 'src/models/scan'
import { Dialog } from 'quasar'
import { status2color } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref(col)
  const data = ref<Vuln[]>([])
  const keyword_filter = ref('')
  // const alive_filter = ref(false)
  const getVulns = async () => {
    loading.value = true
    data.value = await api.getVulns(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getVulns)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this vulnerability?'
    }).onOk(() => {
      api.deleteVuln(id).then(getVulns)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all vulnerabilities of this scan?'
    }).onOk(() => {
      api.deleteVulnAll(scan_id).then(getVulns)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    keyword_filter,
    getVulns,
    del,
    del_all,
    status2color
  }
}

export default defineComponent({
  components: {
    module,
    crudBtn,
    actionBtn,
    scanInfo
  },
  setup(_, { root }) {
    const route = root.$route
    const scan = (route.params.scan as unknown) as Scan
    return { scan, ...useTable(scan.id) }
  }
})
</script>
