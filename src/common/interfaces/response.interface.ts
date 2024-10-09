export interface ResponseBuilder<T> {
  httpStatus: number;
  message: string;
  data?: T | T[];
}

export interface PaginationReponse<T> {
  meta: Meta;
  data: T[];
}

interface Meta {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  currentPage: number;
}
