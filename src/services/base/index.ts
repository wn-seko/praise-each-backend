export interface PaginationResponse<T extends {}> {
  list: T[]
  pagination: {
    currentPage: number
    limit: number
    pages: number
  }
}

export class BaseService {}
