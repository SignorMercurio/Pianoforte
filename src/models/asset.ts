interface Asset {
  id: number
  name: string
  ip: string
  port: number
  url: string
  service: string
  status: number
  domain: string
  vendor: string
  // scan_id: number
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
    name: 'url',
    label: 'URL',
    align: 'left',
    field: 'url',
    sortable: true
  },
  {
    name: 'name',
    label: 'Title',
    align: 'left',
    field: 'name',
    style: 'max-width: 150px',
    classes: 'ellipsis',
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
    name: 'service',
    label: 'Service',
    align: 'left',
    field: 'service',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true
  },
  // {
  //   name: 'domain',
  //   label: 'Domain',
  //   align: 'left',
  //   field: 'domain',
  //   sortable: true
  // },
  {
    name: 'vendor',
    label: 'Vendor',
    align: 'left',
    field: 'vendor',
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

export { Asset, col }
