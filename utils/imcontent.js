import mybuffer from "../libs/mqtt/mybuffer";
import Long from "../libs/mqtt/long";
import ab from "./ab";

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
  static FlAG_IM = 0x7f;

  static TYPE_TEXT = 0x01;
  static TYPE_IMAGE = 0x02;
  static TYPE_VOICE = 0x03;
  static TYPE_VIDEO = 0x04;

  constructor(options) {
    const defaults = {
      flag: MsgBody.FlAG_IM,
      type: MsgBody.TYPE_TEXT,
      from: "",
      to: "",
      timestamp: new Date().getTime().toString(),
      content: "",
    };

    let opts = Object.assign({}, defaults, options);
    this.flag = opts.flag;
    this.type = opts.type;
    this.from = opts.from;
    this.to = opts.to;
    this.timestamp = opts.timestamp;
    this.content = opts.content;
  }
}

export class PubPackage {
  static TOPIC_IM_F_PREFIX = "ims/f/";
  static TOPIC_IM_G_PREFIX = "ims/g/";
  constructor(
    topic,
    msgBody,
    options = new PubPackageOptions(),
    callback = function (err) {}
  ) {
    this.topic = topic;
    this.options = options;
    this.msgBody = msgBody;
    this.callback = callback;
  }
}
export class PubPackageOptions {
  constructor(qos = Qos.AT_MOST_ONCE, retain = false, dup = false) {
    this.qos = qos;
    this.retain = retain;
    this.dup = dup;
  }
}

export const Qos = {
  AT_MOST_ONCE: 0, //
  AT_LEAST_ONCE: 1, //
  EXACTLY_ONCE: 2,
};

export class ReMessage {
  constructor(topic, msg) {
    this.topic = topic;
    this.msg = msg;
  }
}

/**
 *
 * @param {MsgBoy} body
 * @returns
 */
export function body2Buffer(body) {
  //let body = Object.assign(
  //  {
  //   flag: MsgBody.Flag_IM,
  //    type: MsgBody.TYPE_TEXT,
  //  },
  //  msgBody
  // );
  const fromLong = Long.fromString(body.from);
  const toLong = Long.fromString(body.to);
  const timestampLong = Long.fromString(body.timestamp);

  const flag = mybuffer.Buffer.from([body.flag]);
  const type = mybuffer.Buffer.from([body.type]);
  const from = mybuffer.Buffer.from(fromLong.toBytes());
  const to = mybuffer.Buffer.from(toLong.toBytes());
  const timestamp = mybuffer.Buffer.from(timestampLong.toBytes());
  const content = mybuffer.Buffer.from(body.content);
  return mybuffer.Buffer.concat([flag, type, from, to, timestamp, content]);
}

export function buffer2MsgBody(buffer) {
  if (!mybuffer.Buffer.isBuffer(buffer)) {
    return null;
  }

  const flag = buffer.readUInt8(0);
  if (flag !== MsgBody.FlAG_IM) {
    return null;
  }

  const type = buffer.readUInt8(1);

  const fromH = buffer.readUInt32BE(2);
  const fromL = buffer.readUInt32BE(6);
  const from = new Long(fromL, fromH);

  const toH = buffer.readUInt32BE(10);
  const toL = buffer.readUInt32BE(14);
  const to = new Long(toL, toH);

  const timestampH = buffer.readUInt32BE(18);
  const timestampL = buffer.readUInt32BE(22);
  const timestam = new Long(timestampL, timestampH);

  const content = buffer.toString("utf8", 26);

  return new MsgBody({
    flag: flag,
    type: type,
    from: from.toString(),
    to: to.toString(),
    timestam: timestam.toString(),
    content: content,
  });
}

export default {
  ReMessage,
  PubPackageOptions,
  PubPackage,
  Qos,
  MsgBody,
  body2Buffer,
  buffer2MsgBody,
};
