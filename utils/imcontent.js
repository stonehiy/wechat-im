import mybuffer from "../libs/mqtt/mybuffer";
import Long from "../libs/mqtt/long";
import ab from "./ab"

/*
export default {
    content:{
        flag:0xFF,
        type:0x00,
        from:"0",
        to:"0",
        timestamp:"0",
        content:"",
    }


};
*/
export class MsgBody {
  constructor(flag, type, from, to, timestamp, content) {
    this.flag = flag;
    this.type = type;
    this.from = from;
    this.to = to;
    this.timestamp = timestamp;
    this.content = content;
  }
}

export function body2Buffer(body) {
  body = Object.assign(
    {
      flag: 0x7f,
      type: 0x00,
      from: "0",
      to: "0",
      timestamp: "0",
      content: "",
    },
    body
  );
  const fromLong = Long.fromString(body.from);
  const toLong = Long.fromString(body.to);
  const timestampLong = Long.fromString(body.timestamp);

  const flag = mybuffer.Buffer.from([body.flag]);
  const type = mybuffer.Buffer.from([body.type]);
  const from = mybuffer.Buffer.from(fromLong.toBytes());
  const to = mybuffer.Buffer.from(toLong.toBytes());
  const timestamp = mybuffer.Buffer.from(timestampLong.toBytes());
  const content = mybuffer.Buffer.from(body.content);

  const len =
    flag.length +
    type.length +
    from.length +
    to.length +
    timestamp.length +
    content.length;
  console.log(
    "len = ",
    flag.length,
    type.length,
    from.length,
    to.length,
    timestamp.length,
    content.length
  );

  return mybuffer.Buffer.concat([flag, type, from, to, timestamp, content]);
}

export function buffer2MsgBody(buffer) {
  if (!mybuffer.Buffer.isBuffer(buffer)) {
    return null;
  }

  const flag = buffer.readUInt8(0);

  const type = buffer.readUInt8(1);

  const fromH = buffer.readUInt32BE(2);
  const fromL = buffer.readUInt32BE(6);
  const from = new Long(fromL,fromH)

  const toH = buffer.readUInt32BE(10);
  const toL = buffer.readUInt32BE(14);
  const to = new Long(toL,toH)

  const timestampH = buffer.readUInt32BE(18);
  const timestampL = buffer.readUInt32BE(22);
  const timestam = new Long(timestampL,timestampH)

  const content = buffer.toString(26,buffer.length)

  return new MsgBody(flag,type,from.toString(),to.toString(),timestam.toString(),content);
}

export default {
  MsgBody,
  body2Buffer,
  buffer2MsgBody,
};
