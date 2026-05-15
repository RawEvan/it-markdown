/** Split `k=v,k2=v2` on commas, allowing `|` inside values (e.g. options lists). */
export function parseAttrString(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  let i = 0;
  let key = "";
  let val = "";
  let phase: "key" | "val" = "key";

  const commit = () => {
    const k = key.trim().toLowerCase();
    const v = val.trim();
    if (k) out[k] = v;
    key = "";
    val = "";
    phase = "key";
  };

  while (i < raw.length) {
    const ch = raw[i];
    if (phase === "key") {
      if (ch === "=") {
        phase = "val";
        i++;
        continue;
      }
      key += ch;
      i++;
      continue;
    }
    // val
    if (ch === ",") {
      commit();
      i++;
      continue;
    }
    val += ch;
    i++;
  }
  commit();
  return out;
}

export function parseDirectiveDestination(dest: string): {
  subtype: string;
  attrString: string;
  attrs: Record<string, string>;
} | null {
  if (!dest.startsWith("!")) return null;
  const rest = dest.slice(1);
  const colon = rest.indexOf(":");
  if (colon === -1) return null;
  const subtype = rest.slice(0, colon).trim().toLowerCase();
  const attrString = rest.slice(colon + 1);
  return { subtype, attrString, attrs: parseAttrString(attrString) };
}
