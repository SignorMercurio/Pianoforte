<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan"></scan-info>

    <module parent="Scan" icon="find_in_page" name="Ports">
      <template v-slot:card>
        <q-card-section>
          <q-table
            :data="data"
            :columns="columns"
            row-key="id"
            :pagination.sync="pagination"
            :loading="loading"
          >
            <template v-slot:top-right>
              <q-input
                class="col-3"
                outlined
                label="Search IP"
                v-model="keyword_filter"
                debounce="300"
                @input="getPorts"
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
                <q-td key="service" :props="props">
                  {{ props.row.service }}
                  <q-tooltip v-if="props.row.service">{{
                    props.row.service
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <q-btn
                    flat
                    icon="delete"
                    color="negative"
                    @click="del(props.row.id)"
                  ></q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn push color="primary" icon="update" @click="getPorts"></q-btn>
          <q-btn
            push
            color="negative"
            icon="delete_sweep"
            @click="del_all"
          ></q-btn>
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import scanInfo from 'components/ScanInfo.vue'
import { Port, col } from 'src/models/port'
import { Scan } from 'src/models/scan'
import { Dialog } from 'quasar'
import { protocol2color } from 'components/utils'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref(col)
  const data = ref<Port[]>([])
  const keyword_filter = ref('')
  const getPorts = async () => {
    loading.value = true
    data.value = await api.getPorts(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getPorts)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this port?'
    }).onOk(() => {
      api.deletePort(id).then(getPorts)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all ports of this scan?'
    }).onOk(() => {
      api.deletePortAll(scan_id).then(getPorts)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    keyword_filter,
    getPorts,
    del,
    del_all,
    protocol2color
  }
}

export default defineComponent({
  components: {
    scanInfo,
    module
  },
  setup(_, { root }) {
    const route = root.$route
    const scan = (route.params.scan as unknown) as Scan
    return { scan, ...useTable(scan.id) }
  }
})
</script>
