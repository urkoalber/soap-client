import httpRequest from "./httpRequest";
import { HttpClient, RequestOptions } from "./types";

const httpClient: HttpClient = {
  get(url: string, options?: RequestOptions) {
    return httpRequest(url, { ...options, method: "GET" });
  },
  post(url: string, options?: RequestOptions) {
    return httpRequest(url, { ...options, method: "POST" });
  },
};

export default httpClient;
