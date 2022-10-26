
import * as methods from "./methods"
const apn = require('apn');





class Pushr{
  
  
  constructor(pao){

     this.pao = pao 
     this.userTokens = []
     this.apn = apn
 
     this.init = methods.init
     this.handlePushrTask = methods.handlePushrTask 
     this.saveDeviceToken = methods.saveDeviceToken
     this.hookFunkToThingy = methods.hookFunkToThingy
     this.dataRequestHandler = methods.dataRequestHandler 
     this.sendPushNotification = methods.sendPushNotification
     this.getToken = methods.getToken
     this.updateToken = methods.updateToken
     this.sendIOSPush = methods.sendIOSPush
     this.sendAndroidPush = methods.sendAndroidPush


   
    
  }


  

}

export default Pushr