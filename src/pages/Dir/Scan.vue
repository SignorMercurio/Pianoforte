<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Directories">
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
                label="Accessible Directories Only"
                v-model="alive_filter"
                @update:modelValue="getDirs"
              ></q-toggle>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search path"
                v-model="keyword_filter"
                debounce="300"
                @update:modelValue="getDirs"
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
                    :label="props.row.path"
                    no-caps
                    flat
                    dense
                    type="a"
                    :href="scan.target + props.row.path"
                    target="_blank"
                  />
                </q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    v-if="props.row.status"
                    size="sm"
                    :color="status2color(props.row.status)"
                    >{{ props.row.status }}</q-chip
                  >
                </q-td>
                <q-td key="length" :props="props">
                  {{ props.row.length }}
                </q-td>
                <q-td key="redirect" :props="props">
                  {{ props.row.redirect }}
                  <q-tooltip v-if="props.row.redirect">{{
                    props.row.redirect
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn
                    type="del"
                    @click="del('dir', props.row.id, getDirs)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="update" tip="Refresh" @click="getDirs" />
          <action-btn
            color="negative"
            icon="delete_sweep"
            tip="Delete All"
            @click="del_all('dir', scan.id, getDirs)"
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
import { Dir, col } from 'src/models/dir'
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
  const rows = ref<Dir[]>([])
  const keyword_filter = ref('')
  const alive_filter = ref(false)
  const getDirs = async () => {
    loading.value = true
    rows.value = await api.getDirs(
      scan_id,
      keyword_filter.value,
      alive_filter.value
    )
    loading.value = false
  }

  onMounted(getDirs)

  return {
    loading,
    pagination,
    columns,
    rows,
    keyword_filter,
    alive_filter,
    getDirs,
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
    return { scan, ...useTable(scan.id), del, del_all, status2color }
  },
})
</script>
