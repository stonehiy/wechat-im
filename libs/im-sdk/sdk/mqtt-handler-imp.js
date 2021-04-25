import IIMHandler from "../interface/i-im-handler";
// import IQmttEvent from "../interface/i-qmtt-event";
import mqttClinet from "../../../utils/mqttClinet";

export default class MqttHandlerImp extends IIMHandler {
  constructor() {
    super();
  }

  /**
   * 创建WebSocket连接
   * 如：this.imWebSocket = new IMWebSocket();
   *    this.imWebSocket.createSocket({url: 'ws://10.4.97.87:8001'});
   * 如果你使用本地服务器来测试，那么这里的url需要用ws，而不是wss，因为用wss无法成功连接到本地服务器
   * @param options 建立连接时需要的配置信息，这里是传入的url，即你的服务端地址，端口号不是必需的。
   */
  createConnection({ options }) {
    options = Object.assign(
      {
        port: 1884,
        keepalive: 60,
        clientId: options.id,
        clean: true,
        username: "",
        password: "",
        path: "/mqtt",
      },
      options
    );
    // !this._isLogin && 
    console.log("createConnection options = ",options);
    mqttClinet.initMqtt(options);
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
    mqttClinet.onConnect((e) => {});
  }

  /**
   * webSocket是在这里接收消息的
   * @private
   */
  _onSocketMessage() {
    mqttClinet
      .onMessage()
      .then((res) => {
        console.log("_onSocketMessage res = ", res);
      })
      .catch((err) => {
        console.log("_onSocketMessage err = ", err);
      });
  }

  onSubscribe(topic, options, callback = function () {}){
    mqttClinet.subscribe(topic,Object.assign({ qos: 0 }, options),callback)
  }

  onUnsubscribe(topic, options, callback = function () {}){
    mqttClinet.unsubscribe(topic,Object.assign({ qos: 0 }, options),callback)
  }
  
}
