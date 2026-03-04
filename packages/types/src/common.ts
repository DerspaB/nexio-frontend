export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
}
