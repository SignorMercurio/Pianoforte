<template>
  <q-page class="q-pa-lg">
    <module parent="Domains" icon="dns" name="Subdomain Enumerating">
      <template v-slot:card>
        <q-card-section>
          <q-form
            ref="form"
            @submit="scan"
            class="row q-gutter-x-md items-start"
          >
            <q-select
              class="col-2"
              outlined
              option-label="name"
              option-value="id"
              label="Project"
              :options="options"
              v-model="project_id"
              emit-value
              map-options
            ></q-select>
            <q-input
              class="col-6"
              outlined
              label="Domain name"
              v-model="target"
              :hint="hint"
              lazy-rules
              :rules="[val => !!val || '* Required']"
            >
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            push
            color="primary"
            icon="find_in_page"
            @click="formSubmit"
          ></q-btn>
        </q-card-actions>
      </template>
    </module>
    <module parent="Domains" icon="dns" name="Scan Results">
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
              <q-select
                class="col-2"
                outlined
                option-label="name"
                option-value="id"
                label="Project"
                :options="options"
                v-model="project_id_filter"
                emit-value
                map-options
                @input="getScans"
              ></q-select>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search target"
                v-model="keyword_filter"
                debounce="300"
                @input="getScans"
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
                <q-td key="project" :props="props">
                  {{ props.row.project.name }}
                </q-td>
                <q-td key="target" :props="props">
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
                  <q-btn
                    flat
                    icon="more_horiz"
                    color="info"
                    @click="
                      $router.push({
                        name: 'DomainScan',
                        params: { scan: props.row }
                      })
                    "
                  ></q-btn>
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
          <q-btn push color="primary" icon="update" @click="getScans"></q-btn>
          <!-- <q-btn
            push
            color="negative"
            icon="delete_sweep"
            @click="del_all"
          ></q-btn> -->
        </q-card-actions>
      </template>
    </module>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { MainApi } from 'components/axios'
import module from 'components/Module.vue'
import { Project } from 'src/models/project'
import { Scan, col } from 'src/models/scan'
import { Dialog } from 'quasar'
import { success, str2color, fmtTime } from 'src/components/utils'

const api = MainApi.getInstance()

function useScan(store: any) {
  const options = ref<Project[]>(store.getters['project/getProjects'])

  const target = ref('')
  const project_id = ref(1)
  const form = ref()

  function formSubmit() {
    form.value.submit()
  }

  return { options, target, project_id, form, formSubmit }
}

function useTable() {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref(col)
  const data = ref<Scan[]>([])
  const project_id_filter = ref(1)
  const keyword_filter = ref('')
  const getScans = async () => {
    loading.value = true
    data.value = await api.getScans(
      project_id_filter.value,
      'Subdomain Enumeration',
      keyword_filter.value
    )
    loading.value = false
  }

  onMounted(getScans)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this scan?'
    }).onOk(() => {
      api.deleteScan(id).then(getScans)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    project_id_filter,
    keyword_filter,
    getScans,
    del
  }
}

export default defineComponent({
  components: {
    module
  },
  setup(_, { root }) {
    const store = root.$store
    const hint = 'e.g. hackerone.com'

    const {
      loading,
      pagination,
      columns,
      data,
      project_id_filter,
      keyword_filter,
      getScans,
      del
    } = useTable()
    const { options, target, project_id, form, formSubmit } = useScan(store)

    async function scan() {
      const code = await api.scanDomain(project_id.value, target.value)
      if (code) {
        success(`Scanning task #${code} submitted`)
        project_id_filter.value = project_id.value
        getScans()
      }
    }
    return {
      hint,
      loading,
      pagination,
      columns,
      data,
      project_id_filter,
      keyword_filter,
      getScans,
      del,
      options,
      target,
      project_id,
      form,
      formSubmit,
      scan,
      str2color,
      fmtTime
    }
  }
})
</script>
