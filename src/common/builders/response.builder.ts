import { PaginationReponse, ResponseBuilder } from '../interfaces/response.interface';

export class ResponseHandler {
  // Response Builder
  public static responseBuilder<T>(httpStatus: number, message: string, data?: T | T[]): ResponseBuilder<T> {
    // Return response
    const response: ResponseBuilder<T> = {
      httpStatus,
      message,
      data: data || undefined,
    };

    return response;
  }

  // Pagination Reponse
  public static paginationBuilder<T>(items: T[], length: number, itemsPerPage: number, currentPage: number): PaginationReponse<T> {
    const response: PaginationReponse<T> = {
      meta: {
        totalItems: length,
        totalPages: Math.ceil(length / itemsPerPage),
        itemsPerPage,
        currentPage 
      },
      items
    };

    return response;
  }
}
