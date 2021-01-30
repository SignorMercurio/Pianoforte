import { Notify } from 'quasar'

export function success(msg: string, icon = 'check_circle') {
  Notify.create({
    type: 'positive',
    icon: icon,
    message: msg
  })
}

export function fail(msg: string) {
  Notify.create({
    type: 'negative',
    message: msg
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
  return new Date(time).toLocaleString('zh-cn', {
    hour12: false
  })
}
