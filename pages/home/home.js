// import mqttClient from "../../utils/mqttClinet";
// import mybuffer from '../../libs/mqtt/mybuffer'
import {
  MsgBody,
  PubPackage,
  PubPackageOptions,
  Qos,
} from "../../utils/imcontent";
// import ab from '../../utils/ab'

const imHandler = getApp().getIMHandler();

Page({
  data: {},

  onLoad(options) {
    //    mqttClient.initMqtt({id:"wx_121212"})
    //    mqttClient.checkState(e=>{
    //     mqttClient.subscribe("wx/pc",err=>{
    //     })
    //    })
  },

  async onShow() {
    imHandler.setOnReceiveMessageListener({
      listener: (msg) => {
        console.log(msg);
      },
    });
    const topic = "wx/pc";
    imHandler.onSubscribe(topic, {}, (err) => {
      console.log(`${topic} onSubscribe success ${err}`);
    });
  },

  async onTap() {
    // const buf = imcontent.body2Buffer({
    //   type: 0x00,
    //   from: "10",
    //   to: "20",
    //   timestamp: "30",
    //   content: "content",
    // });
    // mqttClient.publish({
    //   topic: "wx/wx",
    //   encryptedData: buf,
    // });

    try {
      let from = new Date().getTime() + 1;
      let to = new Date().getTime() + 2;
      const msg = new MsgBody(
        MsgBody.TYPE_IMAGE,
        from.toString(),
        to.toString(),
        "mmmmmmmm12341234123"
      );
      const pp = new PubPackage("wx/wx", msg, {}, (err) => {
        console.log(err);
      });
      await imHandler.sendMsg({
        content: pp,
      });
    } catch (e) {
      console.log("e = ", e);
    }
  },
});
