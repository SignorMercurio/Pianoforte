interface Dir {
  id: number
  path: string
  status: number
  redirect: string
  length: number
}

const col = [
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: 'id',
    sortable: true
  },
  {
    name: 'path',
    label: 'Path',
    align: 'left',
    field: 'path',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: 'status',
    sortable: true
  },
  {
    name: 'length',
    label: 'Content Length',
    align: 'left',
    field: 'length',
    sortable: true
  },
  {
    name: 'redirect',
    label: 'Redirect',
    align: 'left',
    field: 'redirect',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right'
  }
]

export { Dir, col }
