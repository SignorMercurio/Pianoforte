interface Asset {
  id: number
  ip: string
  port: number
  url: string
  length: number
  service: string
  status: number
  title: string
  server: string
  domain: string
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
    name: 'ip',
    label: 'IP',
    align: 'left',
    field: 'ip',
    sortable: true,
  },
  {
    name: 'port',
    label: 'Port',
    align: 'left',
    field: 'port',
    sortable: true,
  },
  {
    name: 'url',
    label: 'URL',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: 'status',
    sortable: true,
  },
  {
    name: 'length',
    label: 'Content Length',
    align: 'left',
    field: 'length',
    sortable: true,
  },
  {
    name: 'title',
    label: 'Title',
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'service',
    label: 'Service',
    align: 'left',
    field: 'service',
    sortable: true,
  },
  {
    name: 'server',
    label: 'Server',
    align: 'left',
    field: 'server',
    sortable: true,
  },
  {
    name: 'domain',
    label: 'Domain',
    align: 'left',
    field: 'domain',
    sortable: true,
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right',
  },
]

export { Asset, col }
