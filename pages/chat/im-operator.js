import { dealChatTime } from "../../utils/time";
import { MsgBody, PubPackage } from "../../utils/imcontent";

/**
 * 这个类是IM模拟类，作为示例仅供参考。
 */
export default class IMOperator {
  static VoiceType = "voice";
  static TextType = "text";
  static ImageType = "image";
  static VideoType = "video";
  static CustomType = "custom";

  constructor(page, opts) {
    this._page = page;
    this._opts = opts;
    this._latestTImestamp = 0; //最新消息的时间戳
    this._myHeadUrl = getApp().globalData.userInfo.myHeadUrl;
    this._otherHeadUrl = this._opts.friendHeadUrl;
    this._map = new Map();
    this._map.set(MsgBody.TYPE_TEXT, IMOperator.TextType);
    this._map.set(MsgBody.TYPE_IMAGE, IMOperator.ImageType);
    this._map.set(MsgBody.TYPE_VOICE, IMOperator.VoiceType);
    this._map.set(MsgBody.TYPE_VIDEO, IMOperator.VideoType);
  }

  getConvertType(type) {
    return this._map.get(type);
  }

  getFriendId() {
    return this._opts.friendId;
  }

  onSimulateReceiveMsg(cbOk) {
    getApp()
      .getIMHandler()
      .sendMsg({
        content: {
          type: "get-history",
          userId: getApp().globalData.userInfo.userId,
          friendId: this.getFriendId(),
        },
      });
    getApp()
      .getIMHandler()
      .setOnReceiveMessageListener({
        listener: (msg) => {
          if (!msg) {
            return;
          }
          msg.isMy = msg.msgUserId === getApp().globalData.userInfo.userId;
          const item = this.createNormalChatItem(msg);
          // const item = this.createNormalChatItem({type: 'voice', content: '上传文件返回的语音文件路径', isMy: false});
          // const item = this.createNormalChatItem({type: 'image', content: '上传文件返回的图片文件路径', isMy: false});
          this._latestTImestamp = item.timestamp;
          //这里是收到好友消息的回调函数，建议传入的item是 由 createNormalChatItem 方法生成的。
          cbOk && cbOk(item);
        },
      });
  }

  async onSimulateSendMsg({ content }) {
    const that = this;
    //这里content即为要发送的数据
    //这里的content是一个对象了，不再是一个JSON格式的字符串。这样可以在发送消息的底层统一处理。
    try {
      let msgBodyType = 0;
      switch (content.type) {
        case IMOperator.TextType:
          msgBodyType = MsgBody.TYPE_TEXT;
          break;
        case IMOperator.ImageType:
          msgBodyType = MsgBody.TYPE_IMAGE;
          break;
        case IMOperator.VoiceType:
          msgBodyType = MsgBody.TYPE_VOICE;
          break;
        case IMOperator.CustomType:
          msgBodyType = MsgBody.TYPE_VIDEO;
          break;
      }
   
      const fid = that.getFriendId();
      const msg = new MsgBody({
        type: msgBodyType,
        from: getApp().globalData.userInfo.userId,
        to: fid,
        content: content.content,
      });
      const pp = new PubPackage(
        PubPackage.TOPIC_IM_F_PREFIX + `${fid}/${fid}`,
        msg,
        {},
        (err) => {
          console.log(err);
        }
      );
      const res = await getApp().getIMHandler().sendMsg({ content: pp });
      //这个contentSendSuccess格式一样,也是一个对象
      const data = res.msgBody;
      const contentSendSuccess = {
        type: this.getConvertType(data.type),
        content: data.content,
      };
      const cmsg = this.createNormalChatItem(contentSendSuccess);
      this._latestTImestamp = cmsg.timestamp;
      return Promise.resolve({ cmsg });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  createChatItemContent({
    type = IMOperator.TextType,
    content = "",
    duration,
  } = {}) {
    if (!content.replace(/^\s*|\s*$/g, "")) return;
    return {
      content,
      type,
      conversationId: 0, //会话id，目前未用到
      userId: getApp().globalData.userInfo.userId,
      friendId: this.getFriendId(), //好友id
      duration,
    };
  }

  createNormalChatItem({
    type = IMOperator.TextType,
    content = "",
    isMy = true,
    duration,
  } = {}) {
    if (!content) return;
    const currentTimestamp = Date.now();
    const time = dealChatTime(currentTimestamp, this._latestTImestamp);
    let obj = {
      msgId: 0, //消息id
      friendId: this.getFriendId(), //好友id
      isMy, //我发送的消息？
      showTime: time.ifShowTime, //是否显示该次发送时间
      time: time.timeStr, //发送时间 如 09:15,
      timestamp: currentTimestamp, //该条数据的时间戳，一般用于排序
      type, //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
      content, // 显示的内容，根据不同的类型，在这里填充不同的信息。
      headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl, //显示的头像，自己或好友的。
      sendStatus: "success", //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
      voiceDuration: duration, //语音时长 单位秒
      isPlaying: false, //语音是否正在播放
    };
    if (type !== IMOperator.TextType) {
      obj.saveKey = content; //saveKey是存储文件时的key
    }
    return obj;
  }

  static createCustomChatItem() {
    return {
      timestamp: Date.now(),
      type: IMOperator.CustomType,
      content: "会话已关闭",
    };
  }
}
