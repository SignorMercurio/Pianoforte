import { Notify, Dialog, copyToClipboard, date } from 'quasar'
import { MainApi } from './axios'

const api = MainApi.getInstance()

export function success(msg: string, icon = 'check_circle') {
  Notify.create({
    type: 'positive',
    icon: icon,
    message: msg,
  })
}

export function fail(msg: string) {
  Notify.create({
    type: 'negative',
    message: msg,
  })
}

export function status2color(status: number) {
  if (status < 200) return 'accent'
  else if (status < 300) return 'green'
  else if (status < 400) return 'teal'
  else if (status < 500) return 'orange'
  else return 'red'
}

export function str2color(status: string) {
  if (status === 'Pending') return 'orange'
  else if (status === 'Scanning') return 'teal'
  else return 'green'
}

export function protocol2color(protocol: string) {
  if (protocol === 'tcp') return 'secondary'
  else if (protocol === 'udp') return 'orange'
  else return 'grey'
}

export function fmtTime(time: string): string {
  // return new Date(time).toLocaleString('zh-cn', {
  //   hour12: false,
  // })
  return date.formatDate(time, 'YY/MM/DD HH:mm')
}

export function copy(str: string) {
  copyToClipboard(str).then(() => {
    success('Copied')
  })
}

export function full2path(target: string, full_url: string) {
  if (target.endsWith('/')) {
    target = target.slice(0, -1)
  }
  return full_url.replace(target, '')
}

export function del(type: string, id: number, func: any) {
  Dialog.create({
    title: 'Confirm',
    message: `Delete this ${type}?`,
  }).onOk(() => {
    api.delete(type, id).then(func)
  })
}

export function del_all(type: string, scan_id: number, func: any) {
  Dialog.create({
    title: 'Confirm',
    message: `Delete all ${type}s of this scan?`,
  }).onOk(() => {
    api.deleteAll(type, scan_id).then(func)
  })
}
