import { onMounted, ref } from 'vue'
import { Project } from './project'

import { MainApi } from 'components/axios'
import { Dialog } from 'quasar'

interface Scan {
  id: number
  type: string
  target: string
  created_at: Date
  status: string
  project: Project
}

const col = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'project',
    label: 'Project',
    field: (row: Scan) => row.project.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'target',
    label: 'Target',
    field: 'target',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created_at',
    label: 'Created at',
    field: 'created_at',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: true,
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right',
  },
]

function useScan(store: any) {
  const options = ref<Project[]>(store.getters['project/getProjects'])

  const target = ref('')
  const project_id = ref(1)
  const show_advanced = ref(false)
  const args = ref('')
  const form = ref()

  function formSubmit() {
    form.value.submit()
  }

  return { options, target, project_id, show_advanced, args, form, formSubmit }
}

function useTable(api: MainApi, type: string) {
  const loading = ref(true)
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
  })
  const columns = ref(col)
  const rows = ref<Scan[]>([])
  const project_id_filter = ref(1)
  const keyword_filter = ref('')
  const getScans = async () => {
    loading.value = true
    rows.value = await api.getScans(
      project_id_filter.value,
      type,
      keyword_filter.value
    )
    loading.value = false
  }

  onMounted(getScans)

  function del(id: number) {
    Dialog.create({
      title: 'Confirm',
      message: 'Delete this scan?',
    }).onOk(() => {
      api.deleteScan(id).then(getScans)
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
    del,
  }
}

export { Scan, col, useScan, useTable }
