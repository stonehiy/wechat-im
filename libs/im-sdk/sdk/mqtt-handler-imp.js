import IIMHandler from "../interface/i-im-handler";
// import IQmttEvent from "../interface/i-qmtt-event";
import mqttClinet from "../../../utils/mqttClinet";

export default class MqttHandlerImp extends IIMHandler {
  constructor() {
    super();
  }

  /**
   * 如果你使用本地服务器来测试，那么这里的url需要用ws，而不是wss，因为用wss无法成功连接到本地服务器
   * @param options 建立连接时需要的配置信息，这里是传入的url，即你的服务端地址，端口号不是必需的。
   */
  createConnection({options}) {
    // options = Object.assign(
    //   {
    //     port: 1884,
    //     keepalive: 60,
    //     clientId: options.id,
    //     clean: true,
    //     username: "",
    //     password: "",
    //     path: "/mqtt",
    //   },
    //   options
    // );
    // !this._isLogin &&
   
    mqttClinet.initMqtt(options);
    console.log("createConnection options = ", options);
    this._onSocketOpen();
    this._onSocketMessage();
    this._onSocketError();
    this._onSocketClose();
  }

  _sendMsgImp({ content, success, fail }) {
    mqttClinet
      .publishMsgBody(content)
      .then((res) => {
        success && success(res);
      })
      .catch((err) => {
        fail && fail(err);
      });
  }

  /**
   * 关闭webSocket
   */
  closeConnection() {
    mqttClinet.end();
  }

  _onSocketError(cb) {
    mqttClinet.onError((e) => {});
  }

  _onSocketClose(cb) {
    mqttClinet.onClose((e) => {});
    mqttClinet.onOffline((e) => {});
    mqttClinet.onDisconnect((e) => {});
  }

  _onSocketOpen() {
    mqttClinet.onConnect((e) => {
      this.onSubscribe("f/#", { qos: 0 }, (e) => {});
      this.onSubscribe("g/#", { qos: 0 }, (e) => {});
      this.onSubscribe("s/#", { qos: 0 }, (e) => {});
    });
  }

  /**
   * webSocket是在这里接收消息的
   * @private
   */
  _onSocketMessage() {
    mqttClinet
      .onMessage((res)=>{
        this._receiveListener && this._receiveListener(res);
        console.log("_onSocketMessage res = ", res);
      },
     )
      
  }

  onSubscribe(topic, options, callback = function () {}) {
    console.log("onSubscribe = ", topic, options);
    mqttClinet.subscribe(topic, Object.assign({ qos: 0 }, options), callback);
  }

  onUnsubscribe(topic, options, callback = function () {}) {
    console.log("onUnsubscribe = ", topic, options);
    mqttClinet.unsubscribe(topic, Object.assign({ qos: 0 }, options), callback);
  }

 

}
