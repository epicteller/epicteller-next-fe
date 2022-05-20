export interface PagingResponse<T> {
  data: T[]
  paging?: PagingInfo
}

export interface PagingInfo {
  isEnd?: boolean
  next?: string
  prev?: string
  total?: number
}
