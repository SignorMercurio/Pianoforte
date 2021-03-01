export interface Header {
  key: string
  value: string | number
}

export interface Tools {
  port_http: number[]
  httpx_args: string
  oneforall_args: string
  amass_args: string
  subfinder_args: string
  nmap_args: string
  masscan_args: string
  naabu_args: string
  dirsearch_args: string
  whatweb_args: string
  rad_args: string
  hakrawler_args: string
}

export interface Data {
  name: string
  value: string | number
}
