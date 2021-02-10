<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />
    <chart :id="scan.id" type="domains" a-name="Alive" b-name="Level" />

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
            <template v-slot:top>
              <q-toggle
                label="Alive Domains Only"
                v-model="alive_filter"
                @update:modelValue="getDomains"
              ></q-toggle>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search domain name"
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
                <q-td key="alive" :props="props">
                  <q-icon
                    v-if="props.row.alive"
                    name="check_circle"
                    color="positive"
                  ></q-icon>
                  <q-icon v-else name="cancel" color="negative"></q-icon>
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
                <q-td key="ip" :props="props" @click="copy(props.row.ip)">
                  {{ props.row.ip }}
                  <q-tooltip v-if="props.row.ip">{{ props.row.ip }}</q-tooltip>
                </q-td>
                <q-td key="cname" :props="props" @click="copy(props.row.cname)">
                  {{ props.row.cname }}
                  <q-tooltip v-if="props.row.cname">{{
                    props.row.cname
                  }}</q-tooltip>
                </q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    v-if="props.row.status"
                    size="sm"
                    :color="status2color(props.row.status)"
                    >{{ props.row.status }}</q-chip
                  >
                </q-td>
                <q-td key="title" :props="props" @click="copy(props.row.title)">
                  {{ props.row.title }}
                  <q-tooltip v-if="props.row.title">{{
                    props.row.title
                  }}</q-tooltip>
                </q-td>
                <q-td
                  key="banner"
                  :props="props"
                  @click="copy(props.row.banner)"
                >
                  {{ props.row.banner }}
                  <q-tooltip v-if="props.row.banner">{{
                    props.row.banner
                  }}</q-tooltip>
                </q-td>
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
import scanInfo from 'components/ScanInfo.vue'
import chart from 'components/Chart.vue'
import { Domain, col } from 'src/models/domain'
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
  const rows = ref<Domain[]>([])
  const keyword_filter = ref('')
  const alive_filter = ref(false)
  const getDomains = async () => {
    loading.value = true
    rows.value = await api.getDomains(
      scan_id,
      keyword_filter.value,
      alive_filter.value
    )
    loading.value = false
  }

  onMounted(getDomains)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    alive_filter,
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
        from: 'Subdomain',
        to: 'Ports',
        target: row.subdomain,
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
    scanInfo,
    chart,
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
      copy,
    }
  },
})
</script>
