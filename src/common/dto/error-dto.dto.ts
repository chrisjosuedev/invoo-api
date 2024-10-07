export class ErrorDto<T> {
  constructor(
    private message: string,
    private statusCode: number,
    private details?: T | T[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details || undefined;
  }
}
