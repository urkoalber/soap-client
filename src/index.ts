import { HttpClient } from "./http-client/types";
import defaultHttpClient from "./http-client/httpClient";
import { buildXML, parseXML } from "./xml";

export interface SoapOptions {
  xmlNamespace?: string;
  xmlPrefix?: string;
  targetNamespace?: string;
  soapHeader?: Record<string, unknown>;
  httpHeaders?: Record<string, string>;
}

export interface SoapClientProps {
  endpoint: string;
  options?: SoapOptions;
  httpClient?: HttpClient;
}

export default class SoapClient {
  private endpoint: string;
  private options: SoapOptions;
  private httpClient: HttpClient;

  constructor(props: SoapClientProps) {
    this.endpoint = props.endpoint;
    this.options = {
      xmlNamespace: "http://www.w3.org/2003/05/soap-envelope",
      xmlPrefix: "soap",
      ...props.options,
    };
    this.httpClient = props.httpClient || defaultHttpClient;
  }

  private buildBody(
    method: string,
    data: Record<string, unknown>,
    moreOptions: SoapOptions = {}
  ) {
    const options = {
      ...this.options,
      ...moreOptions,
    };
    return buildXML({
      [`${options.xmlPrefix}:Envelope`]: {
        ["@xmlns:" + options.xmlPrefix]: options.xmlNamespace,
        [`${options.xmlPrefix}:Header`]: options.soapHeader,
        [`${options.xmlPrefix}:Body`]: {
          [method]: {
            "@xmlns": options.targetNamespace,
            ...data,
          },
        },
      },
    });
  }

  async call(
    method: string,
    data: Record<string, unknown>,
    moreOptions?: SoapOptions
  ): Promise<Record<string, unknown>> {
    const options = {
      ...this.options,
      ...moreOptions,
    };
    console.log(this.buildBody(method, data, moreOptions));

    const response = await this.httpClient.post(this.endpoint, {
      headers: options.httpHeaders,
      body: this.buildBody(method, data, moreOptions),
    });

    const body = parseXML(response.data).Envelope?.Body;
    if (!body) {
      throw new Error("Invalid SOAP response");
    }
    if (body.Fault) {
      throw new Error("SOAP Fault");
    }
    return body;
  }
}
