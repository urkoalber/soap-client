import http from "node:http";
import https from "node:https";

import { RequestOptions, Response } from "./types";

export default function httpRequest(url: string, options: RequestOptions) {
  return new Promise<Response>((resolve, reject) => {
    const endpoint = new URL(url);
    const lib = endpoint.protocol === "https:" ? https : http;
    const req = lib.request(
      {
        hostname: endpoint.hostname,
        path: endpoint.pathname,
        port: endpoint.port,
        ...options,
      },
      (res) => {
        const data: string[] = [];
        res.on("data", (chunk) => {
          data.push(String(chunk));
        });
        res.on("end", () => {
          const isOK =
            Number(res.statusCode) > 199 && Number(res.statusCode) < 299;
          resolve({
            statusCode: res.statusCode || 500,
            statusMessage: res.statusMessage,
            ok: isOK,
            headers: res.headers,
            data: data.join(""),
          });
        });
        res.on("error", (err) => {
          reject(err);
        });
      }
    );

    if (options.method === "POST" && options.body) {
      let body = String(options.body);
      if (typeof options.body === "object") {
        req.setHeader("Content-Type", "application/json");
        body = JSON.stringify(options.body);
      }
      req.setHeader("Content-Length", Buffer.byteLength(body));
      req.write(options.body);
    }
    req.end();
    console.log(req.getHeaders());
  });
}
