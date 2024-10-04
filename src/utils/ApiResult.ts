export class ApiResult {
  private statusCode: number = 200;
  private error: string | undefined = undefined;

  success() {
    this.statusCode = 200;
    this.error = undefined;
    return this;
  }

  notFound(error?: string) {
    this.statusCode = 404;
    this.error = error ?? "not found";
    return this;
  }

  badRequest(error?: string) {
    this.statusCode = 400;
    this.error = error ?? "Bad Request";
    return this;
  }

  serverError(error?: string) {
    this.statusCode = 500;
    this.error = error ?? "internal server error";
    return this;
  }

  json(result: any) {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({ data: result, error: this.error || null }),
    };
  }
}
