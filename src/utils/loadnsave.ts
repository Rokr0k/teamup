export type Members = {
  [id: number]: {
    name: string;
    score: number;
  };
};

export async function load(buffer: ArrayBuffer): Promise<Members> {
  const { decode } = await import("iconv-lite");
  const data = decode(new Uint8Array(buffer), "euc-kr")
    .split(/\r?\n/g)
    .map((line) => line.split(/[,;\t]/g).map((a) => a.trim()))
    .filter((data) => data[0].length > 0)
    .map((data) => ({ name: data[0], score: +data[1] || 0 }));
  const members: Members = {};
  data.forEach((data, i) => (members[i + 1] = data));
  console.log(data);
  return members;
}

export async function save(members: Members): Promise<ArrayBuffer> {
  const content = Object.entries(members)
    .reduce<string[]>((members, [id, { name, score }]) => {
      members[+id] = `${name},${score}\r\n`;
      return members;
    }, [])
    .join("");
  const { encode } = await import("iconv-lite");
  const data = encode(content, "euc-kr") as Uint8Array;
  console.log(data);
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}
