<template>
  <module :parent="parent" :icon="icon" name="Scan Results">
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
              @update:modelValue="getScans"
            ></q-select>
            <q-space></q-space>
            <q-input
              class="col-3"
              outlined
              label="Search target"
              v-model="keyword_filter"
              debounce="300"
              @update:modelValue="getScans"
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
              <td-long key="target" :value="props.row.target" />
              <q-td key="created_at" :props="props">
                {{ fmtTime(props.row.created_at) }}
              </q-td>
              <q-td key="status" :props="props">
                <q-chip :color="str2color(props.row.status)" size="sm">
                  {{ props.row.status }}
                </q-chip>
              </q-td>
              <q-td key="op" :props="props">
                <crud-btn type="info" @click="toInfo(props.row)" />
                <crud-btn type="del" @click="del(props.row.id)" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <action-btn icon="update" tip="Refresh" @click="getScans" />
      </q-card-actions>
    </template>
  </module>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Scan } from 'src/models/scan'
import module from './Module.vue'
import crudBtn from './Buttons/CrudBtn.vue'
import actionBtn from './Buttons/ActionBtn.vue'
import tdLong from './Columns/TdLong.vue'
import { fmtTime, str2color } from './utils'

export default defineComponent({
  name: 'scanRes',
  components: {
    module,
    crudBtn,
    actionBtn,
    tdLong,
  },
  props: {
    parent: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const loading = inject('loading')
    const pagination = inject('pagination')
    const columns = inject('columns')
    const rows = inject('rows')
    const project_id_filter = inject('project_id_filter')
    const keyword_filter = inject('keyword_filter')
    const getScans = inject('getScans')
    const del = inject('del') as (id: number) => null

    function toInfo(row: Scan) {
      sessionStorage.setItem('scan', JSON.stringify(row))
      router.push({
        name: `${props.parent}Scan`,
      })
    }

    return {
      loading,
      pagination,
      columns,
      rows,
      project_id_filter,
      keyword_filter,
      getScans,
      toInfo,
      del,
      fmtTime,
      str2color,
    }
  },
})
</script>
