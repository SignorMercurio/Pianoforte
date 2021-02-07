<template>
  <q-page class="q-pa-lg">
    <module parent="Projects" icon="format_list_numbered" name="Statistics">
      <template v-slot:card>
        <div class="row justify-between">
          <cnt icon="find_in_page" :num="details.Scans" type="Scans" />
          <cnt icon="web" :num="details.Assets" type="Assets" />
          <cnt icon="dns" :num="details.Domains" type="Domains" />
          <cnt icon="donut_large" :num="details.Ports" type="Ports" />
        </div>
        <div class="row justify-between">
          <cnt icon="folder" :num="details.Directories" type="Directories" />
          <cnt
            icon="fingerprint"
            :num="details.Fingerprints"
            type="Fingerprints"
          />
          <cnt icon="link" :num="details.Endpoints" type="Endpoints" />
          <cnt
            icon="bug_report"
            :num="details.Vulnerabilities"
            type="Vulnerabilities"
          />
        </div>
      </template>
    </module>

    <chart :id="project_id" a-name="Type" b-name="Target" />

    <module parent="Projects" icon="format_list_numbered" name="Scan Results">
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
              <q-select
                class="col-2"
                outlined
                label="Type"
                :options="options"
                v-model="type_filter"
                @update:modelValue="getScans"
              ></q-select>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search target"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getScans"
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
                <q-td
                  key="target"
                  :props="props"
                  @click="copy(props.row.target)"
                >
                  {{ props.row.target }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ fmtTime(props.row.created_at) }}
                </q-td>
                <q-td key="status" :props="props">
                  <q-chip :color="str2color(props.row.status)" size="sm">
                    {{ props.row.status }}
                  </q-chip>
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn type="info" @click="toInfo(props.row)" />
                  <crud-btn type="del" @click="del(props.row.id)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="update" tip="Refresh" @click="getScans" />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MainApi } from 'components/axios'
import { Scan } from 'src/models/scan'
import { col, Detail } from 'src/models/project'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import cnt from 'components/Cnt.vue'
import chart from 'components/Chart.vue'
import { Dialog } from 'quasar'
import { copy, fmtTime, str2color } from 'components/utils'

const api = MainApi.getInstance()

function useTable(router: any, project_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Scan[]>([])
  const options = [
    'All',
    'Assets',
    'Domains',
    'Ports',
    'Directories',
    'Fingerprints',
    'Endpoints',
    'Vulnerabilities',
  ]
  const type_filter = ref('All')
  const keyword_filter = ref('')
  const getScans = async () => {
    loading.value = true
    rows.value = await api.getScans(
      project_id,
      type_filter.value,
      keyword_filter.value
    )
    loading.value = false
  }

  onMounted(getScans)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this scan?',
    }).onOk(() => {
      api.deleteScan(id).then(getScans)
    })
  }

  function toInfo(row: Scan) {
    sessionStorage.setItem('scan', JSON.stringify(row))
    router.push({
      name: `${row.type}Scan`,
    })
  }

  return {
    loading,
    pagination,
    columns,
    rows,
    options,
    type_filter,
    keyword_filter,
    getScans,
    del,
    toInfo,
  }
}

function useStat(project_id: number) {
  const details = ref<Detail>({
    Scans: 0,
    Assets: 0,
    Domains: 0,
    Ports: 0,
    Directories: 0,
    Fingerprints: 0,
    Endpoints: 0,
    Vulnerabilities: 0,
  })
  const getDetails = async () => {
    details.value = await api.getDetails(project_id)
  }

  onMounted(getDetails)

  return {
    details,
  }
}

export default defineComponent({
  components: {
    module,
    crudBtn,
    actionBtn,
    cnt,
    chart,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const project_id = parseInt(route.query.id as string)
    return {
      project_id,
      ...useTable(router, project_id),
      ...useStat(project_id),
      copy,
      fmtTime,
      str2color,
    }
  },
})
</script>
