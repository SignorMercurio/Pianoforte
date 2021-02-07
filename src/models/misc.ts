export interface Header {
  key: string
  value: string | number
}

export interface Tools {
  port_http: number[]
  port_https: number[]
  asset_args: string
  domain_args: string
  port_args: string
  dir_args: string
  finger_args: string
  hak_args: string
}

export interface Data {
  name: string
  value: string | number
}
