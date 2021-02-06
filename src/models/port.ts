interface Port {
  id: number
  protocol: string
  port: number
  ip: string
  service: string
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
    name: 'ip',
    label: 'IP',
    align: 'left',
    field: 'ip',
    sortable: true
  },
  {
    name: 'port',
    label: 'Port',
    align: 'left',
    field: 'port',
    sortable: true
  },
  {
    name: 'protocol',
    label: 'Protocol',
    align: 'left',
    field: 'protocol',
    sortable: true
  },
  {
    name: 'service',
    label: 'Service',
    align: 'left',
    field: 'service',
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

export { Port, col }
