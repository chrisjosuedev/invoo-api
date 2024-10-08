export class ErrorDto<T> {
  constructor(
    private statusCode: number,
    private message: string,
    private details?: T | T[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details || undefined;
  }
}
