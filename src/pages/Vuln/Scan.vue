<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Vulnerabilities">
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
              <!-- <q-toggle
                label="Alive Vulns Only"
                v-model="alive_filter"
                @update:modelValue="getVulns"
              ></q-toggle> -->
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search vulnerability type"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getVulns"
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
                <q-td key="vuln_type" :props="props">
                  {{ props.row.vuln_type }}
                </q-td>
                <q-td key="url" :props="props">
                  <q-btn
                    size="sm"
                    color="blue"
                    style="max-width: 200px"
                    no-caps
                    flat
                    dense
                    type="a"
                    :href="props.row.url"
                    target="_blank"
                  >
                    <div class="ellipsis">
                      {{ full2path(scan.target, props.row.url) }}
                    </div>
                  </q-btn>
                </q-td>
                <q-td
                  key="param_key"
                  :props="props"
                  @click="copy(props.row.param_key)"
                >
                  {{ props.row.param_key }}
                  <q-tooltip v-if="props.row.param_key">{{
                    props.row.param_key
                  }}</q-tooltip>
                </q-td>
                <q-td key="param_pos" :props="props">
                  {{ props.row.param_pos }}
                  <q-tooltip v-if="props.row.param_pos">{{
                    props.row.param_pos
                  }}</q-tooltip>
                </q-td>
                <q-td
                  key="param_val"
                  :props="props"
                  @click="copy(props.row.param_val)"
                >
                  {{ props.row.param_val }}
                  <q-tooltip v-if="props.row.param_val">{{
                    props.row.param_val
                  }}</q-tooltip>
                </q-td>
                <q-td key="payload" :props="props">
                  {{ props.row.payload }}
                  <q-tooltip v-if="props.row.payload">{{
                    props.row.payload
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn
                    type="del"
                    @click="del('vuln', props.row.id, getVulns)"
                  />
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
            @click="del_all('vuln', scan.id, getVulns)"
          />
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import scanInfo from 'components/ScanInfo.vue'
import { Vuln, col } from 'src/models/vuln'
import { Scan } from 'src/models/scan'
import { del, del_all, status2color, copy, full2path } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Vuln[]>([])
  const keyword_filter = ref('')
  // const alive_filter = ref(false)
  const getVulns = async () => {
    loading.value = true
    rows.value = await api.getVulns(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getVulns)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    getVulns,
  }
}

export default defineComponent({
  components: {
    module,
    crudBtn,
    actionBtn,
    scanInfo,
  },
  setup() {
    const route = useRoute()
    const scan = JSON.parse(route.params.scan as string) as Scan
    return {
      scan,
      ...useTable(scan.id),
      del,
      del_all,
      status2color,
      copy,
      full2path,
    }
  },
})
</script>
