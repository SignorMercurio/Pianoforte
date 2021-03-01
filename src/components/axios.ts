import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Notify } from 'quasar'

import { Token, User, UserCreate } from 'src/models/user'
import { ProjectCreate, Project, Detail } from 'src/models/project'
import { Scan } from 'src/models/scan'
import { Asset } from 'src/models/asset'
import { Domain } from 'src/models/domain'
import { Port } from 'src/models/port'
import { Dir } from 'src/models/dir'
import { Finger } from 'src/models/finger'
import { Vuln } from 'src/models/vuln'
import { Endpoint } from 'src/models/endpoint'
import { Header, Data, Tools } from 'src/models/misc'

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {
  protected readonly instance: AxiosInstance

  public constructor(baseURL = 'http://localhost:8000', timeout = 4000) {
    this.instance = axios.create({
      baseURL,
      timeout,
    })
    this._initializeResponseInterceptor()
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleErrorResp
    )
  }

  private _handleResponse = ({ data }: AxiosResponse) => data

  protected _handleErrorResp = (err: any) => {
    if (err.response) {
      Notify.create({
        type: 'negative',
        message: err.response.data.detail as string,
      })
    } else {
      Notify.create({
        type: 'negative',
        message: 'Request timeout...',
      })
    }

    Promise.reject(err)
  }
}

class NoAuthApi extends HttpClient {
  private static classInstance?: NoAuthApi

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new NoAuthApi()
    }
    return this.classInstance
  }

  public login = ({ username, password }: UserCreate) =>
    this.instance.post<Token>(
      'users/login',
      `username=${username}&password=${password}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
}

class MainApi extends HttpClient {
  private static classInstance?: MainApi

  private constructor() {
    super()
    this._initializeRequestInterceptor()
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new MainApi()
    }
    return this.classInstance
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError
    )
  }

  private _handleRequest = (config: AxiosRequestConfig) => {
    const token = sessionStorage.getItem('token') as string
    config.headers['Authorization'] = `Bearer ${token}`

    return config
  }

  private _handleError = (err: any) => Promise.reject(err)

  public getUser = () => this.instance.get<User>('users')

  public getProjects = () => this.instance.get<Project[]>('projects/all')
  public getProject = (id: number) =>
    this.instance.get<Project>(`projects?id=${id}`)
  public createProject = (data: ProjectCreate) =>
    this.instance.post<number>('projects', data)
  public editProject = (id: number, data: ProjectCreate) =>
    this.instance.put<number>(`projects?id=${id}`, data)
  public deleteProject = (id: number) =>
    this.instance.delete(`projects?id=${id}`)

  public getScans = (project_id: number, type: string, keyword: string) =>
    this.instance.get<Scan[]>(
      `scans/all?project_id=${project_id}&type=${type}&keyword=${keyword}`
    )
  public getScansData = (project_id: number) =>
    this.instance.get<Data[][]>(`scans/data?project_id=${project_id}`)
  public deleteScan = (id: number) => this.instance.delete(`scans?id=${id}`)

  public getAssets = (scan_id: number, keyword: string) =>
    this.instance.get<Asset[]>(
      `assets/all?scan_id=${scan_id}&keyword=${keyword}`
    )
  public delete = (type: string, id: number) =>
    this.instance.delete(`${type}s?id=${id}`)
  public deleteAll = (type: string, scan_id: number) =>
    this.instance.delete(`${type}s/all?scan_id=${scan_id}`)
  public scanAsset = (project_id: number, target: string, args: string) =>
    this.instance.post<number>(
      `assets/scan?project_id=${project_id}&target=${target}`,
      args
    )

  public getData = (type: string, scan_id: number) =>
    this.instance.get<Data[][]>(`${type}/data?scan_id=${scan_id}`)
  public getExport = (type: string, scan_id: number, export_type: string) =>
    this.instance.get<Blob>(
      `${type}/export?scan_id=${scan_id}&type=${export_type}`,
      {
        responseType: 'blob',
      }
    )

  public getDomains = (scan_id: number, keyword: string, alive: boolean) =>
    this.instance.get<Domain[]>(
      `domains/all?scan_id=${scan_id}&keyword=${keyword}&alive=${String(alive)}`
    )
  public scanDomain = (
    project_id: number,
    target: string,
    oneforall_args: string,
    amass_args: string,
    subfinder_args: string
  ) =>
    this.instance.post<number>(
      `domains/scan?project_id=${project_id}&target=${target}`,
      { oneforall_args, amass_args, subfinder_args }
    )

  public getPorts = (scan_id: number, keyword: string) =>
    this.instance.get<Port[]>(`ports/all?scan_id=${scan_id}&keyword=${keyword}`)
  public scanPort = (
    project_id: number,
    target: string,
    ports_tcp: string,
    ports_udp: string,
    nmap_args: string,
    masscan_args: string,
    naabu_args: string
  ) =>
    this.instance.post<number>(
      `ports/scan?project_id=${project_id}&target=${target}`,
      { ports_tcp, ports_udp, nmap_args, masscan_args, naabu_args }
    )

  public getDirs = (scan_id: number, keyword: string, alive: boolean) =>
    this.instance.get<Dir[]>(
      `dirs/all?scan_id=${scan_id}&keyword=${keyword}&alive=${String(alive)}`
    )
  public scanDir = (
    project_id: number,
    target: string,
    ext: string,
    args: string
  ) =>
    this.instance.post<number>(
      `dirs/scan?project_id=${project_id}&target=${target}`,
      { ext, args }
    )

  public getFingers = (scan_id: number) =>
    this.instance.get<Finger[]>(`fingers/all?scan_id=${scan_id}`)
  public scanFinger = (project_id: number, target: string, args: string) =>
    this.instance.post<number>(
      `fingers/scan?project_id=${project_id}&target=${target}`,
      args
    )

  public getEndpoints = (scan_id: number, keyword: string) =>
    this.instance.get<Endpoint[]>(
      `endpoints/all?scan_id=${scan_id}&keyword=${keyword}`
    )
  public scanEndpoint = (
    project_id: number,
    target: string,
    args: string,
    args_hak: string
  ) =>
    this.instance.post<number>(
      `endpoints/scan?project_id=${project_id}&target=${target}`,
      { args, args_hak }
    )

  public getVulns = (scan_id: number, keyword: string) =>
    this.instance.get<Vuln[]>(`vulns/all?scan_id=${scan_id}&keyword=${keyword}`)
  public scanVuln = (project_id: number, target: string, escan_id: number) =>
    this.instance.post<number>(
      `vulns/scan?project_id=${project_id}&target=${target}&escan_id=${escan_id}`
    )

  public getTimeout = () => this.instance.get<number>('config/timeout')
  public setTimeout = (timeout: number) =>
    this.instance.put<number>(`config/timeout?timeout=${timeout}`)
  public getHeaders = () => this.instance.get<Header[]>('config/headers')
  public setHeaders = (headers: Header[]) =>
    this.instance.put<number>('config/headers', headers)
  public getTools = () => this.instance.get<Tools>('config/tools')
  public setTools = (tools: Tools) =>
    this.instance.put<number>('config/tools', tools)

  public getDetails = (id: number) =>
    this.instance.get<Detail>(`projects/details?id=${id}`)
}

export { NoAuthApi, MainApi }
