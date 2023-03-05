# soap-client
Simple SOAP client for TypeScript

Dependencies:
- fast-xml-parser

Usage example:
```typescript
import { SoapClient } from 'soap-client';

const client = new SoapClient({
  endpoint: "https://www.emtmadrid.es/MapaWebServicios/ServiciosMapaWeb.asmx",
  options: {
    targetNamespace: "http://tempuri.org/",
    httpHeaders: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  },
});

client
  .call("ListadoParadasLinea", { ID: "361", SENTIDO: 1 })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err.message);
  });
```