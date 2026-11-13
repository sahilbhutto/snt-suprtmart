
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiErrorBody {
  status: number;
  message: string;
  code?: string;
  fields?: Record<string, string>;
}
