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
                <!-- <q-td key="desc" :props="props" @click="copy(props.row.desc)">
                  {{ props.row.desc }}
                  <q-tooltip v-if="props.row.desc">{{
                    props.row.desc
                  }}</q-tooltip>
                </q-td>
                <q-td key="severity" :props="props">
                  {{ props.row.severity }}
                </q-td> -->
                <q-td
                  key="payload"
                  :props="props"
                  @click="copy(props.row.payload)"
                >
                  {{ props.row.payload }}
                  <q-tooltip v-if="props.row.payload">{{
                    props.row.payload
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn
                    type="info"
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'expand_less' : 'expand_more'"
                  />
                  <crud-btn
                    type="del"
                    @click="del('vuln', props.row.id, getVulns)"
                  />
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <q-splitter v-model="splitter" style="height: 305px">
                    <template v-slot:before>
                      <q-input
                        filled
                        readonly
                        type="textarea"
                        input-style="height: 300px"
                        v-model="props.row.req"
                      ></q-input>
                    </template>
                    <template v-slot:after>
                      <q-input
                        filled
                        readonly
                        type="textarea"
                        input-style="height: 300px"
                        v-model="props.row.resp"
                      ></q-input>
                    </template>
                  </q-splitter>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <export-btn :id="scan.id" type="vulns" />
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
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import crudBtn from 'components/Buttons/CrudBtn.vue'
import actionBtn from 'components/Buttons/ActionBtn.vue'
import exportBtn from 'components/Buttons/ExportBtn.vue'
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
  const splitter = ref(50)
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
    splitter,
    getVulns,
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
