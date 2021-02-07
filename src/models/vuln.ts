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
    sortable: true,
  },
  {
    name: 'vuln_type',
    label: 'Vuln Type',
    align: 'left',
    field: 'vuln_type',
    sortable: true,
  },
  {
    name: 'url',
    label: 'URL',
    align: 'left',
    field: 'url',
  },
  // {
  //   name: 'desc',
  //   label: 'Description',
  //   align: 'left',
  //   field: 'desc',
  //   style: 'max-width: 150px',
  //   classes: 'ellipsis',
  // },
  // {
  //   name: 'severity',
  //   label: 'Severity',
  //   align: 'left',
  //   field: 'severity',
  //   sortable: true,
  // },
  {
    name: 'payload',
    label: 'Payload',
    align: 'left',
    field: 'payload',
    style: 'max-width: 150px',
    classes: 'ellipsis',
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right',
  },
]

export { Vuln, col }
