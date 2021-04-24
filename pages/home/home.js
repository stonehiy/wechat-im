import mqttClient from '../../utils/mqttClinet'

Page({
    data:{

    },
  
     
    onLoad(options) {
        console.log("onload")
       mqttClient.initMqtt({id:"wx_121212"})
 

    },
    onTap() {
        console.log("onTap",mqttClient)
        mqttClient.publish({
            topic:"wx_test/a",
            encryptedData:[1,13,14]
        })
    }
})