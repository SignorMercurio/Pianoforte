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

export function fmtTime(timestamp: number): string {
  return new Date(Math.floor(timestamp * 1000)).toLocaleString('zh-cn', {
    hour12: false
  })
}
