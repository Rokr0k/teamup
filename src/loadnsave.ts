import { Buffer } from "buffer";
import { decode, encode } from "iconv-lite";

export type Members = {
  [id: number]: {
    name: string;
    score: number;
  };
};

export function load(buffer: ArrayBuffer): Members;
export function load(buffer: ArrayBuffer): Members {
  const data = decode(new Buffer(buffer), "euc-kr")
    .split(/\r?\n/g)
    .map((line) => line.split(/[,;\t]/g).map((a) => a.trim()))
    .filter((data) => data[0].length > 0)
    .map((data) => ({ name: data[0], score: +data[1] || 0 }));
  const members: Members = {};
  data.forEach((data, i) => (members[i + 1] = data));
  return members;
}

export function save(members: Members): ArrayBuffer {
  const content = Object.entries(members)
    .reduce<string[]>((members, [id, { name, score }]) => {
      members[+id] = `${name},${score}`;
      return members;
    }, [])
    .join("\r\n");
  return encode(content, "euc-kr");
}
