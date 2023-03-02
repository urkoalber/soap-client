import http from "node:http";

export interface RequestOptions extends http.RequestOptions {
  body?: unknown;
}

export interface Response {
  statusCode: number;
  statusMessage?: string;
  ok: boolean;
  headers: http.IncomingHttpHeaders;
  data: string;
}

export interface HttpClient {
  get(url: string, options?: RequestOptions): Promise<Response>;
  post(url: string, options?: RequestOptions): Promise<Response>;
}
