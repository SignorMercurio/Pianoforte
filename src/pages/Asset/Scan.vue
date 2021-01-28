<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan"></scan-info>

    <module parent="Scan" icon="find_in_page" name="Assets">
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
                label="Search URL"
                v-model="keyword_filter"
                debounce="300"
                @input="getAssets"
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
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                  <q-tooltip v-if="props.row.name">{{
                    props.row.name
                  }}</q-tooltip>
                </q-td>
                <q-td key="status" :props="props"
                  ><q-chip
                    v-if="props.row.status"
                    size="sm"
                    :color="status2color(props.row.status)"
                    >{{ props.row.status }}</q-chip
                  ></q-td
                >
                <q-td key="service" :props="props">
                  {{ props.row.service }}
                  <q-tooltip v-if="props.row.service">{{
                    props.row.service
                  }}</q-tooltip>
                </q-td>
                <!-- <q-td key="domain" :props="props">
                  {{ props.row.domain }}
                </q-td> -->
                <q-td key="vendor" :props="props">
                  {{ props.row.vendor }}
                  <q-tooltip v-if="props.row.vendor">{{
                    props.row.vendor
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
          <q-btn push color="primary" icon="update" @click="getAssets"></q-btn>
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
import { Asset, col } from 'src/models/asset'
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
  const data = ref<Asset[]>([])
  const keyword_filter = ref('')
  const getAssets = async () => {
    loading.value = true
    data.value = await api.getAssets(scan_id, keyword_filter.value)
    loading.value = false
  }

  onMounted(getAssets)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this asset?'
    }).onOk(() => {
      api.deleteAsset(id).then(getAssets)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all assets of this scan?'
    }).onOk(() => {
      api.deleteAssetAll(scan_id).then(getAssets)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    keyword_filter,
    getAssets,
    del,
    del_all,
    status2color
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
