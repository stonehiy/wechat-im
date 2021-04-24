
import mqtt from '../libs/mqtt/mqtt'
const mqttClient = {
    ws: {},
    pramas: {},
    initMqtt (options) {
      this.pramas = Object.assign({
        port: 1884,
        keepalive: 60,
        clientId: options.id,
        clean: true,
        username: '',
        password: '',
        path: '/mqtt'
      }, options)
      this.ws = mqtt('wx://127.0.0.1', this.pramas)
      this.ws.on('connect', (e) => {
        // if (Reflect.has(Dialog, 'close'))Dialog.close()
        console.log(`${this.pramas.clientId}连接成功`)
        
      })
      this.ws.on('error', (e) => {
        console.log('error', e)
      })
      this.ws.on('offline', (e) => {
        console.log('offline', e)
      })
      this.ws.on('disconnect', (e) => {
        console.log('disconnect', e)
      })
      this.ws.on('close', (e) => {
        console.log('close', e)
      })
      this.ws.on('message', (topic, payload) => {
        console.log('%c收到message，解密前原始数据', 'color:#0088f5', payload)
        //let data = common.decryptedData(payload)
        console.log('%c解密完成数据：', 'color:#0088f5;', data)
       
      })
    },
    checkState (success = function () { }) {
      this.ws.on('connect', (e) => {
        console.log(`${this.pramas.clientId}连接成功`)
        success(e)
      })
    },
    /**
     * 自定义mqtt publish (9)
     * @param {Object} data 总数据
     * @param {String} data.topic topic
     * @param {Array} data.encryptedData 加密数据
     * @param {Object} data.options mqtt publish options
     * @param {Object} data.timeOut 超时时间
     */
    publish (data) {
      return new Promise((resolve, reject) => {
        data = Object.assign({
          topic: '',
          encryptedData: [],
          options: {},
        }, data)
        if (data.topic === '') console.error('[publish.topic] can not be undefined')
       
        console.log('发送数据:', new Uint8Array(data.encryptedData))
        this.ws.publish(data.topic, new Uint8Array(data.encryptedData), Object.assign({ qos: 0 }, data.options), (err) => {
          if (err) {
            console.log(err)
          } else {
            console.log('%c数据发送成功', 'color:#ea3800')
          }
        })
      })
    },
    end () {
      this.ws.end()
    },
    destroy () {
    
    },
    subscribe (topic, options, callback = function () { }) {
      this.ws.subscribe(topic, Object.assign({ qos: 0 }, options), (err) => {
        if (err) {
            console.log("subscribe err :",err)
          
        }
        callback(err)
      })
    },
    unsubscribe (topic, options, callback = function () { }) {
      this.ws.unsubscribe(topic, Object.assign({ qos: 0 }, options), (err) => {
        if (!err) {
          callback()
        }
      })
    },
    /**
     * 自定义mqtt sendMessage (11)
     * @param {Object} t 总数据
     * @param {Object} t._this vue实例
     * @param {Array} t.data 加密前数据
     * @param {String} t.equiImei 设备Imei
     * @param {Boolean} t.showInterval 展示定时器
     * @param {Boolean} t.showFailTip 展示错误提示
     * @param {String} t.message 信息提示
     * @param {Object} t.subscribePrefix sub前缀
     * @param {Object} t.publishPrefix pub前缀
     * @param {Object} t.DialogOptions Dialog参数
     * @param {Object} t.options mqtt publish options
     * @param {Object} t.timeOut 超时时间
     */
    sendMessage (t) {
      return new Promise((resolve, reject) => {
        t = Object.assign({
          _this: null,
          data: [],
          equiImei: '',
          showInterval: !0,
          showFailTip: !0,
          message: '同步中',
          subscribePrefix: '2/5',
          publishPrefix: '2/3',
          options: {},
          timeOut: 10
        }, t)
        this.subscribe(`${t.subscribePrefix}/${t.equiImei}`, {}, (err) => {
          if (!err) {
            getEquiKey({
              equiImei: t.equiImei
            })
              .then(res => {
                if (res.code === 0) {
                  this.publish({
                    _this: t._this,
                    topic: `${t.publishPrefix}/${t.equiImei}`,
                    encryptedData: common.getEncryptedData(t.cmdType, [...t.data], res.data),
                    options: t.options,
                    showInterval: t.showInterval,
                    message: t.message,
                    showFailTip: t.showFailTip,
                    timeOut: t.timeOut
                  })
                    .then(res => {
                      console.log('数据获取失败')
                      resolve(res)
                    })
                }
              })
          }
        })
      })
    }
  }


export default mqttClient