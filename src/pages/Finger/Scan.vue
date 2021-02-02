<template>
  <q-page class="q-pa-lg">
    <scan-info :scan="scan" />

    <module parent="Scan" icon="find_in_page" name="Fingerprints">
      <template v-slot:card>
        <q-card-section>
          <q-table
            :data="data"
            :columns="columns"
            row-key="id"
            :pagination.sync="pagination"
            :loading="loading"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="tool" :props="props">
                  {{ props.row.tool }}
                </q-td>
                <q-td key="finger" :props="props">
                  {{ props.row.finger }}
                  <q-tooltip v-if="props.row.finger">{{
                    props.row.finger
                  }}</q-tooltip>
                </q-td>
                <q-td key="op" :props="props">
                  <crud-btn type="del" @click="del(props.row.id)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <action-btn icon="update" tip="Refresh" @click="getFingers" />
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
import { Finger, col } from 'src/models/finger'
import { Scan } from 'src/models/scan'
import { Dialog } from 'quasar'

const api = MainApi.getInstance()

function useTable(scan_id: number) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref(col)
  const data = ref<Finger[]>([])
  const getFingers = async () => {
    loading.value = true
    data.value = await api.getFingers(scan_id)
    loading.value = false
  }

  onMounted(getFingers)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this fingerprint?'
    }).onOk(() => {
      api.deleteFinger(id).then(getFingers)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all fingerprints of this scan?'
    }).onOk(() => {
      api.deleteFingerAll(scan_id).then(getFingers)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    getFingers,
    del,
    del_all
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
