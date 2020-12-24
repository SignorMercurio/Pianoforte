import { Table } from '../models/misc'
import { Notify } from 'quasar'

export function success(ops: string, icon = 'check_circle') {
  Notify.create({
    type: 'positive',
    icon: icon,
    message: `${ops} successfully`
  })
}

export function fail(msg: string) {
  Notify.create({
    type: 'negative',
    message: msg
  })
}

export function getList(url: string, table: Table) {
  table.loading = true
  /*
  this.$axios.get(url).then(res => {
    if (res) {
      table.data = res.data.data
    }
    table.loading = false
  })*/
}

export function fmtTime(timestamp: number): string {
  return new Date(Math.floor(timestamp * 1000)).toLocaleString('zh-cn', {
    hour12: false
  })
}
