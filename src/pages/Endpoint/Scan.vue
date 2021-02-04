<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Endpoints">
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
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search path"
                v-model="keyword_filter"
                debounce="300"
                @input="getEndpoints"
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
                  <crud-btn type="del" @click="del(props.row.id)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="update" tip="Refresh" @click="getEndpoints" />
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
import { Endpoint, col } from 'src/models/endpoint'
import { Scan } from 'src/models/scan'
import { Dialog } from 'quasar'
import { full2path } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref(col)
  const data = ref<Endpoint[]>([])
  const keyword_filter = ref('')
  const getEndpoints = async () => {
    loading.value = true
    data.value = await api.getEndpoints(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getEndpoints)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this endpoint?'
    }).onOk(() => {
      api.deleteEndpoint(id).then(getEndpoints)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all endpoints of this scan?'
    }).onOk(() => {
      api.deleteEndpointAll(scan_id).then(getEndpoints)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    keyword_filter,
    getEndpoints,
    del,
    del_all,
    full2path
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
