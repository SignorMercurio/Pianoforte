interface Endpoint {
  id: number
  path: string
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
    name: 'op',
    label: 'Operations',
    align: 'right'
  }
]

export { Endpoint, col }
