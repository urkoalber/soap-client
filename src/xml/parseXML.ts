import { XMLParser } from "fast-xml-parser";

export default function parseXML(xml: string) {
  const parser = new XMLParser({
    ignorePiTags: true,
    removeNSPrefix: true,
  });

  return parser.parse(xml);
}
