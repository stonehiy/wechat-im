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
  data: {
    text: "text view",
  },

  onLoad(options) {
   
  },

  async onShow() {

    let that = this;
    imHandler.setOnReceiveMessageListener({
      listener: (msg) => {
        console.log("home msg =", msg);
      },
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
      const msg = new MsgBody({
        type:MsgBody.TYPE_TEXT,
        from:"666666",
        to:"123123",
        content:"TYPE_TEXT mmmmmmmm 12341234123"}
      );
      const pp = new PubPackage(PubPackage.TOPIC_IM_F_PREFIX+"123123/123123", msg, {}, (err) => {
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
