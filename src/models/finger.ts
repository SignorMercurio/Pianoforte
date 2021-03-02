interface Finger {
  id: number
  tool: string
  finger: string
}

const col = [
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'tool',
    label: 'Tool',
    align: 'left',
    field: 'tool',
    sortable: true,
  },
  {
    name: 'finger',
    label: 'Fingerprint',
    align: 'left',
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right',
  },
]

export { Finger, col }
