import { XMLBuilder } from "fast-xml-parser";

export default function buildXML(obj: unknown) {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
  });

  return String(builder.build(obj));
}
