export interface ValidationError {
  loc: (string | number)[]
  type: string
  msg: string
}

export interface ValidationErrorResponse {
  detail: ValidationError[]
}

export interface EpictellerError {
  code: number
  message: string
  detail: any
}
