<template>
  <q-page class="q-pa-lg">
    <module parent="Domain" icon="dns" name="Subdomain Enumerating">
      <template v-slot:card>
        <q-card-section class="row q-gutter-x-sm items-start">
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
          >
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn push color="primary" icon="find_in_page" @click="scan"></q-btn>
        </q-card-actions>
      </template>
    </module>
    <module parent="Domain" icon="dns" name="Subdomain List">
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
                class="col-2 q-mr-md"
                outlined
                option-label="name"
                option-value="id"
                label="Project"
                :options="options"
                v-model="project_id_filter"
                emit-value
                map-options
                @input="getDomains"
              ></q-select>
              <q-toggle
                label="Alive Domains Only"
                v-model="alive_filter"
                @input="getDomains"
              ></q-toggle>
              <q-space></q-space>
              <q-input
                class="col-3"
                outlined
                label="Search domain name"
                v-model="keyword_filter"
                debounce="300"
                @input="getDomains"
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
                <q-td key="ip" :props="props">
                  {{ props.row.ip }}
                  <q-tooltip v-if="props.row.ip">{{ props.row.ip }}</q-tooltip>
                </q-td>
                <q-td key="cname" :props="props">
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
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                  <q-tooltip v-if="props.row.title">{{
                    props.row.title
                  }}</q-tooltip>
                </q-td>
                <q-td key="banner" :props="props">
                  {{ props.row.banner }}
                  <q-tooltip v-if="props.row.banner">{{
                    props.row.banner
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
          <q-btn push color="primary" icon="update" @click="getDomains"></q-btn>
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
import { Domain, col } from 'src/models/domain'
import { Dialog } from 'quasar'
import { Project } from 'src/models/project'
import { success, status2color } from 'src/components/utils'

const api = MainApi.getInstance()

function useScan() {
  const options = ref<Project[]>([])
  const getOptions = async () => {
    options.value = await api.getProjects()
  }

  onMounted(getOptions)

  const target = ref('')
  const project_id = ref(1)

  async function scan() {
    const code = await api.scanDomain(project_id.value, target.value)
    if (code === 0) {
      success('Scanning task submitted')
    }
  }

  return { options, getOptions, target, project_id, scan }
}

function useTable() {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  const columns = ref(col)
  const data = ref<Domain[]>([])
  const project_id_filter = ref(1)
  const keyword_filter = ref('')
  const alive_filter = ref(false)
  const getDomains = async () => {
    loading.value = true
    data.value = await api.getDomains(
      project_id_filter.value,
      keyword_filter.value,
      alive_filter.value
    )
    loading.value = false
  }

  onMounted(getDomains)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this domain?'
    }).onOk(() => {
      api.deleteDomain(id).then(getDomains)
    })
  }

  function del_all() {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete all domains of this project?'
    }).onOk(() => {
      api.deleteDomainAll(project_id_filter.value).then(getDomains)
    })
  }

  return {
    loading,
    pagination,
    columns,
    data,
    project_id_filter,
    keyword_filter,
    alive_filter,
    getDomains,
    del,
    del_all,
    status2color
  }
}

export default defineComponent({
  components: {
    module
  },
  setup() {
    const hint = 'e.g. hackerone.com'
    return { hint, ...useScan(), ...useTable() }
  }
})
</script>
