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
    name: 'title',
    label: 'Title',
    align: 'left',
    field: 'title',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true,
  },
  {
    name: 'service',
    label: 'Service',
    align: 'left',
    field: 'service',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true,
  },
  {
    name: 'server',
    label: 'Server',
    align: 'left',
    field: 'server',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true,
  },
  {
    name: 'domain',
    label: 'Domain',
    align: 'left',
    field: 'domain',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true,
  },
  {
    name: 'op',
    label: 'Operations',
    align: 'right',
  },
]

export { Asset, col }
