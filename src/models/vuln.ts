interface Vuln {
  id: number
  url: string
  param_key: string
  param_pos: string
  param_val: string
  payload: string
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
    name: 'vuln_type',
    label: 'Vuln Type',
    align: 'left',
    field: 'vuln_type',
    sortable: true
  },
  {
    name: 'url',
    label: 'URL',
    align: 'left',
    field: 'url'
  },
  {
    name: 'param_key',
    label: 'Param Key',
    align: 'left',
    field: 'param_key',
    style: 'max-width: 150px',
    classes: 'ellipsis'
  },
  {
    name: 'param_pos',
    label: 'Param Position',
    align: 'left',
    field: 'param_pos',
    sortable: true
  },
  {
    name: 'param_val',
    label: 'Param Value',
    align: 'left',
    field: 'param_val',
    style: 'max-width: 150px',
    classes: 'ellipsis'
  },
  {
    name: 'payload',
    label: 'Payload',
    align: 'left',
    field: 'payload',
    style: 'max-width: 150px',
    classes: 'ellipsis'
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right'
  }
]

export { Vuln, col }
