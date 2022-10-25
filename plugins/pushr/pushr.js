
import * as methods from "./methods"





class Pushr{
  
  
  constructor(pao){

     this.pao = pao
 
     this.init = methods.init
     this.handlePushrTask = methods.handlePushrTask 
     this.getBlogPostWith = methods.getBlogPostWith 
     this.hookFunkToThingy = methods.hookFunkToThingy
     this.blogrDoHandler = methods.blogrDoHandler
   
    
  }


  

}

export default Pushr