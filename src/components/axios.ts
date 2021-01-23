import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Notify } from 'quasar'
import { Status } from 'src/models/misc'

import { AccountStateInterface } from 'src/store/module-account/state'
import { Token, User, UserCreate } from 'src/models/user'
import { ProjectCreate, Project } from 'src/models/project'
import { Asset } from 'src/models/asset'

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
      this._handleError
    )
  }

  private _handleResponse = ({ data }: AxiosResponse) => data

  protected _handleError = (err: any) => {
    Notify.create({
      type: 'negative',
      message: err.response.data.detail as string
    })
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

  public getUser = () => this.instance.get<User>('users')

  public getProjects = () => this.instance.get<Project[]>('projects/all')
  public getProject = (id: number) =>
    this.instance.get<Project>(`projects?id=${id}`)
  public createProject = (data: ProjectCreate) =>
    this.instance.post<Status>('projects', data)
  public editProject = (data: Project) =>
    this.instance.put<Status>('projects', data)
  public deleteProject = (id: number) =>
    this.instance.delete(`projects?id=${id}`)

  public getAssets = (project_id: number, keyword?: string) =>
    this.instance.get<Asset[]>(
      `assets/all?project_id=${project_id}&keyword=${keyword}`
    )
  public deleteAsset = (id: number) => this.instance.delete(`assets?id=${id}`)
  public deleteAssetAll = (project_id: number) =>
    this.instance.delete(`assets/all?project_id=${project_id}`)
  public scanAsset = (project_id: number, target: string) =>
    this.instance.post(`assets/scan?project_id=${project_id}&target=${target}`)
}

export { NoAuthApi, MainApi }
