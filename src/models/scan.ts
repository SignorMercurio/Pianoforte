import { Project } from './project'

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
    sortable: true
  },
  {
    name: 'project',
    label: 'Project',
    field: (row: Scan) => row.project.name,
    align: 'left',
    sortable: true
  },
  {
    name: 'target',
    label: 'Target',
    field: 'target',
    align: 'left',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Created at',
    field: 'created_at',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: true
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right'
  }
]

export { Scan, col }
