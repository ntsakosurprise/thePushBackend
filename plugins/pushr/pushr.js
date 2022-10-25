
import * as methods from "./methods"





class Pushr{
  
  
  constructor(pao){

     this.pao = pao
 
     this.init = methods.init
     this.handlePushrTask = methods.handlePushrTask 
     this.saveDeviceToken = methods.saveDeviceToken
     this.hookFunkToThingy = methods.hookFunkToThingy
     this.dataRequestHandler = methods.dataRequestHandler 
     this.sendPushNotification = methods.sendPushNotification
     this.getToken = methods.getToken
     this.updateToken = methods.updateToken
   
    
  }


  

}

export default Pushr