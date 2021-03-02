interface Domain {
  id: number
  subdomain: string
  url: string
  level: number
  ip: string
  cname: string
  status: number
  title: string
  server: string
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
    name: 'subdomain',
    label: 'Subdomain',
    align: 'left',
    field: 'subdomain',
    sortable: true,
  },
  {
    name: 'level',
    label: 'Level',
    align: 'left',
    field: 'level',
    sortable: true,
  },
  {
    name: 'url',
    label: 'URL',
    align: 'left',
  },
  {
    name: 'ip',
    label: 'IP',
    align: 'left',
    field: 'ip',
    sortable: true,
  },
  {
    name: 'cname',
    label: 'CNAME',
    align: 'left',
    field: 'cname',
    sortable: true,
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
    name: 'op',
    label: 'Operations',
    align: 'right',
  },
]

export { Domain, col }
