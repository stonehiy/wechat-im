import mqttClient from '../../utils/mqttClinet'
// import mybuffer from '../../libs/mqtt/mybuffer'
import imcontent from '../../utils/imcontent'
// import ab from '../../utils/ab'

Page({
    data:{

    },
  
     
    onLoad(options) {
        console.log("onload")
       mqttClient.initMqtt({id:"wx_121212"})
 

    },
    onTap() {
     const buf = imcontent.body2Buffer({
            type:0x00,
            from:"10",
            to:"20",
            timestamp:"30",
            content:"content",
        })
        mqttClient.publish({
            topic:"wx_test/a",
            encryptedData:buf
        })
    }
})