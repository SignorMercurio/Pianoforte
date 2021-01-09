export interface User {
  id: number
  username: string
}

export interface UserCreate {
  username: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}
