interface Domain {
  id: number
  alive: boolean
  subdomain: string
  level: number
  url: string
  ip: string
  cname: string
  status: number
  title: string
  banner: string
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
    name: 'subdomain',
    label: 'Subdomain',
    align: 'left',
    field: 'subdomain',
    sortable: true
  },
  {
    name: 'alive',
    label: 'Alive',
    align: 'left'
  },
  {
    name: 'level',
    label: 'Level',
    align: 'left',
    field: 'level',
    sortable: true
  },
  {
    name: 'url',
    label: 'URL',
    align: 'left'
  },
  {
    name: 'ip',
    label: 'IP',
    align: 'left',
    field: 'ip',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true
  },
  {
    name: 'cname',
    label: 'CNAME',
    align: 'left',
    field: 'cname',
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
    name: 'title',
    label: 'Title',
    align: 'left',
    field: 'title',
    style: 'max-width: 150px',
    classes: 'ellipsis',
    sortable: true
  },
  {
    name: 'banner',
    label: 'Banner',
    align: 'left',
    field: 'banner',
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

export { Domain, col }
