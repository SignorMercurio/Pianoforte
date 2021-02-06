interface Project {
  id: number
  name: string
}

interface ProjectCreate {
  name: string
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
    name: 'type',
    label: 'Type',
    field: 'type',
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

export { Project, ProjectCreate, col }
