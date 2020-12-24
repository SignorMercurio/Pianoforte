export interface User {
  id: number
  username: string
}

export interface CreateUserBody {
  username: string
  password: string
}
