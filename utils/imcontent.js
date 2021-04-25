import mybuffer from '../libs/mqtt/mybuffer'
import Long from '../libs/mqtt/long'

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
export  class MsgBody{
    constructor(flag,type,from,to,timestamp,content){
        this.flag = flag
        this.type = type
        this.from = from
        this.to = to
        this.timestamp = timestamp
        this.content = content
    }
}

export function body2Buffer(body){
    body  = Object.assign({
        flag:0x7F,
        type:0x00,
        from:"0",
        to:"0",
        timestamp:"0",
        content:"",
    },body)
  const fromLong =  Long.fromString(body.from)
  const toLong =  Long.fromString(body.to)
  const timestampLong =  Long.fromString(body.timestamp)

  const flag = mybuffer.Buffer.from([body.flag])
  const type = mybuffer.Buffer.from([body.type])
  const from =  mybuffer.Buffer.from(fromLong.toBytes())
  const to =  mybuffer.Buffer.from(toLong.toBytes())
  const timestamp =  mybuffer.Buffer.from(timestampLong.toBytes())
  const content =  mybuffer.Buffer.from(body.content)

  const len = flag.length + type.length + from.length + to.length + timestamp.length + content.length
  console.log("len = ",flag.length , type.length  , from.length , to.length  , timestamp.length , content.length);

  return  mybuffer.Buffer.concat([flag,type,from,to,timestamp,content])
}

export default {
    MsgBody,
    body2Buffer,

}
