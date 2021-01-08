import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Notify } from 'quasar'
import { ProjectCreate, Project } from 'src/models/project'
import { UserCreate } from '../models/user'

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

  public createUser = (data: UserCreate) => this.instance.post('users', data)
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
    config.headers['Authorization'] = ''
    return config
  }

  public getUser = (username: string) =>
    this.instance.get(`users?username=${username}`)

  public getProjects = () => this.instance.get('projects/all')
  public getProject = (id: number) => this.instance.get(`projects?id=${id}`)
  public createProject = (data: ProjectCreate) =>
    this.instance.post('projects', data)
  public editProject = (data: Project) => this.instance.put('projects', data)
  public deleteProject = (id: number) =>
    this.instance.delete(`projects?id=${id}`)
}

export { NoAuthApi, MainApi }
