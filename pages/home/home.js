import mqttClient from '../../utils/mqttClinet'
// import mybuffer from '../../libs/mqtt/mybuffer'

Page({
    data:{

    },
  
     
    onLoad(options) {
        console.log("onload")
       mqttClient.initMqtt({id:"wx_121212"})
 

    },
    onTap() {
        // mybuffer.Buffer.from()
        console.log("onTap",mqttClient)
        mqttClient.publish({
            topic:"wx_test/a",
            encryptedData:[0x01,0x13,14,12,32,34,55,66,77,55,88,44,55,44,55,44,53,1,11,11,33,44,33,33,22 ]
        })
    }
})