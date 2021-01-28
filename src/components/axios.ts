import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Notify } from 'quasar'

import { AccountStateInterface } from 'src/store/module-account/state'
import { Token, User, UserCreate } from 'src/models/user'
import { ProjectCreate, Project } from 'src/models/project'
import { Scan } from 'src/models/scan'
import { Asset } from 'src/models/asset'
import { Domain } from 'src/models/domain'

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {
  protected readonly instance: AxiosInstance

  public constructor(baseURL = 'http://localhost:8000', timeout = 4000) {
    this.instance = axios.create({
      baseURL,
      timeout
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
        message: err.response.data.detail as string
      })
    } else {
      Notify.create({
        type: 'negative',
        message: 'Request timeout...'
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
          'Content-Type': 'application/x-www-form-urlencoded'
        }
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
    const { token } =
      (JSON.parse(
        sessionStorage.getItem('state') as string
      ) as AccountStateInterface) || {}
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

  public getScans = (project_id: number, type?: string, keyword?: string) =>
    this.instance.get<Scan[]>(
      `scans/all?project_id=${project_id}&type=${type}&keyword=${keyword}`
    )
  public deleteScan = (id: number) => this.instance.delete(`scans?id=${id}`)

  public getAssets = (scan_id: number, keyword?: string) =>
    this.instance.get<Asset[]>(
      `assets/all?scan_id=${scan_id}&keyword=${keyword}`
    )
  public deleteAsset = (id: number) => this.instance.delete(`assets?id=${id}`)
  public deleteAssetAll = (scan_id: number) =>
    this.instance.delete(`assets/all?scan_id=${scan_id}`)
  public scanAsset = (project_id: number, target: string) =>
    this.instance.post<number>(
      `assets/scan?project_id=${project_id}&target=${target}`
    )

  public getDomains = (scan_id: number, keyword?: string, alive?: boolean) =>
    this.instance.get<Domain[]>(
      `domains/all?scan_id=${scan_id}&keyword=${keyword}&alive=${alive}`
    )
  public deleteDomain = (id: number) => this.instance.delete(`domains?id=${id}`)
  public deleteDomainAll = (scan_id: number) =>
    this.instance.delete(`domains/all?scan_id=${scan_id}`)
  public scanDomain = (project_id: number, target: string) =>
    this.instance.post<number>(
      `domains/scan?project_id=${project_id}&target=${target}`
    )
}

export { NoAuthApi, MainApi }
