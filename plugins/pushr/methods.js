


const path = require('path');

export const init = function(){
  
  
    this.log('Blog has been initialised') 
    this.listens({
          
      'handle-pushr-task': this.handlePushrTask.bind(this),
      //'get-new-jobs': this.handleGetNewJobs.bind(this)
    
    })
  
      
  }
  
  
export const handlePushrTask = async function(data){
  
      
      
      const self = this 
      const pao = self.pao
      const contains = pao.pa_contains
      const isOBject = pao.pa_isObject 
      // const clientRequest = data.payload.request
      let user = data.payload.user 
      self.callback = data.callback 
      self.infoSync(data)
  
      // let uid = user.ID
      self.infoSync('THE USER IN PUSHR')
      self.infoSync(user)
      
  // console.log('the parsed data test')
      // console.log(data)
      // console.log(user)
      // self
      // .getJobs(user)
      // .then((jobs)=>{self.callback(null,jobs)})
      // .catch((e)=>{
      // 	console.log('Reject error')
      // 	console.log(e0
      // 	self.callback(e,null)
      // })
  
  
      
  
      if(!isOBject(user)) return self.callback({message: 'User has not been specified'},null)
      if(!user.action) return self.callback({message: 'Invalid request'},null)
      if(!contains(user,['payload'])) return self.callback({message: 'missing required payload'},null)
       
      // if(!contains(user.payload,['ID'])) return self.callback({message: 'missing required key'},null)

  
    
   switch(user.action){
  
          
          
          case 'registerDeviceToken': {
              
              self.infoSync('THE Device Token')
              self.infoSync(user.payload)
            //   return self.callback(null,{pushr: {message: 'Device has been successfully saved'}})
             
          
            return self.saveDeviceToken(user.payload)
			.then((saved)=>{

                console.log('SaveDeviceTokenStatus',saved)
                if(saved) return self.callback(null,{pushr: {message: 'Device has been successfully saved'}})
                return self.callback({actionStatus:false,message:'There was a server error saving a bookmark'})
			})
			.catch((e)=>{
                self.infoSync('THE ERROR IN REGISTER DEVICE')
                self.infoSync(e)
                return self.callback(e,null)
            })
              

              
          }
          break;
          case 'sendPushNotifications':{
              
            self.sendPushNotification(user.payload)
			.then((saved)=>{

                console.log('sendPushNotification',saved)
                if(saved) return self.callback(null,{pushr: {message: 'Push was successfully made'}})
                return self.callback({actionStatus:false,message:'There was a server error sending push'})
			})
			.catch((e)=>{
                self.infoSync('THE ERROR IN send push notification')
                self.infoSync(e)
                return self.callback(e,null)
            })
              
          }
          break; 
  
       
          default: 
          self.callback(new Error('Unknown data request'),null)
          
          
      }
  
  
  
}  
  
  
  export const saveDeviceToken = function(pay){

	return new Promise((resolve,reject)=>{

        
        const self = this 
		let pao = self.pao 
        let isUser = null
		let pushr = pay.pushr
        let foundUserIndex = -1 

        const {email=null,deviceToken=null,os=null} = pushr
          
          
          if(!email) return reject(new Error('email key is required'))
          if(!deviceToken) return reject(new Error('deviceToken key is required'))
          self.userTokens = [...self.userTokens,{email,deviceToken,os}]

        isUser = self.userTokens.find((value,index)=>{

              if(value.email.toLowerCase() === email.toLowerCase()){
                foundUserIndex = index
                return true
              }

          })

        if(foundUserIndex >= 0){
            self.infoSync(JSON.stringify(self.userTokens))
            self.userTokens[foundUserIndex] = {...isUser,deviceToken: deviceToken}
            return resolve(true)
        }

        self.userTokens = [...self.userTokens,{email,deviceToken,os}]
        self.infoSync(JSON.stringify(self.userTokens))
        return resolve(true)

          

        // self.getToken(email).then((foundToken)=>{

        //     if(!foundToken){
        //         let query = {
                      
        //             fields: ['id','email','device_token','os'],
        //             values: [null,email,deviceToken,os]
        //               }
        
               
                  
              
              
        //           self.query(
        //                   'mysql.push_token.insert',
        //                     query,
        //                     self.dataRequestHandler.bind(this,resolve,reject)
        //               )
                      
        //     }else{

        //         self.updateToken(deviceToken).then((updatedToken)=>{
        //             self.infoSync('getToken success')
        //             self.infoSync(updatedToken)
        //             return resolve(updatedToken)

        //         }).catch((e)=>{
        //             self.infoSync('updateToken error')
        //             self.infoSync(e)
        //             return reject(e)
        //         })
        //     }

        // }).catch((e)=> {
        //     self.infoSync('getToken Error')
        //     self.infoSync(e)
        //     return reject(e)
        // })


        
      
      
      })
  



	
	
}
  export const sendPushNotification = function(pay){
  
    
    return new Promise((resolve,reject)=>{

        const self = this 
		let pao = self.pao 
		let push = pay.push
        let {platform='',pushPayload} = push

        if(platform === 'ios'){
            self.sendIOSPush(pushPayload).then((pushed)=>{

                self.infoSync('PUSH SUCCESSFULLY MADE ios')
                self.infoSync(pushed)

                return resolve(true)

            })
            .catch((error)=>{

                self.infoSync("ios push error")
                self.infoSync(error)
                return reject(error)

            })
        }else{
            self.sendAndroidPush(pushPayload).then((pushed)=>{

                self.infoSync('PUSH SUCCESSFULLY MADE ANDROID')
                self.infoSync(pushed)

                return resolve(true)

            })
            .catch((error)=>{

                self.infoSync("ANDROID push error")
                self.infoSync(error)
                return reject(error)

            })
        }

    })
         
      
    
  }

  export const sendIOSPush = function(pay){
    
    const self = this
    const {apn} = self
    // const {push} = pay
    const {deviceToken} = pay
    
    return new Promise((resolve,reject)=>{



        self.infoSync('THE PROVIDER')
        self.infoSync(apn)
        self.infoSync('the filepath')
        self.infoSync(path.resolve(__dirname,'./apn_auth.p8'))
        self.infoSync('dEVICE TOKEN')
        self.infoSync(deviceToken)

        var options = {
            token: {
              key: path.resolve(__dirname,'./apn_auth.p8'),
              keyId: "9JKVMLQ73V",
              teamId: "9JKVMLQ73V",
              
            },
            production: false
          };

        self.infoSync('TOKEN OPTIONS;;;')
        self.infoSync(options)
           
          var apnProvider = new apn.Provider(options);
        //   let deviceToken = "a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7"

          var note = new apn.Notification();
 
            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 3;
            // note.sound = "ping.aiff";
            note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
            note.payload = {'messageFrom': 'Ntsako Surprise'};
            note.topic = "org.reactjs.native.example.todoPushr";

            apnProvider.send(note, deviceToken).then((result) => {
                self.infoSync('THE PUSH RESULTS;;;')
                self.infoSync(result)
                resolve({pushed: true, result: result, pushMessage: 'pushed to apn'})
              }).catch((error)=>{

                console.log('the push error')
                return reject(error)
              });
        
    })

  }

  export const sendAndroidPush = function(pay){

    return new Promise((resolve,reject)=>{

        var options = {
            token: {
              key: "apn_auth.p8",
              keyId: "9JKVMLQ73V",
              teamId: "9JKVMLQ73V"
            },
            production: false
          };
           
          var apnProvider = new apn.Provider(options);
          let deviceToken = "a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7"

          var note = new apn.Notification();
 
            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 3;
            // note.sound = "ping.aiff";
            note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
            note.payload = {'messageFrom': 'Ntsako Surprise'};
            note.topic = "org.reactjs.native.example.todoPushr";

            apnProvider.send(note, deviceToken).then( (result) => {
                self.infoSync('THE PUSH RESULTS;;;')
                self.infoSync(result)
              }).catch((error)=>{

                console.log('the push error')
                return reject(error)
              });
        
    })

  }

  export const getToken = function(email){
	
	
	return new Promise((resolve,reject)=>{
		
		
		const self = this 
		const pao = self.pao 
		// let uid = pay.ID
		
		self.infoSync('getToken')
        self.infoSync(email)
        self.infoSync(self.query)
		
		let queries = {

			returnFields: ['*'],
			conditions: [`email EQUALS ${email}`]
		 }
		
	
		self.query(
				'mysql.push_token.find',
				queries,
				self.dataRequestHandler.bind(this,resolve,reject)
			)
			
		
	})

}

export const updateToken = function(email,token){
	
	
	return new Promise((resolve,reject)=>{
		
		
		const self = this 
		const pao = self.pao 
		
		
		
		
		let query = 
					{
				
					//tables:[table],
					condtions: [`email ISEQUALS ${email}`],
					set: {device_token: token}
				}

            self.query(
                `mysql.push_token.update`,
                query,
                self.dataRequestHandler.bind(this,resolve,reject)
                )
		
	})

}
  
  
  
  export const hookFunkToThingy = function(hooky,hook,args = null){
        
         
      if(args){
          return hook.bind(hooky,...args)
      }else{
          return hook.bind(hooky)
      }
    
  }
  
  

  export const dataRequestHandler = function(resolve=null,reject=null,e=null,results=null){

	const self = this 
	let pao = self.pao

	self.infoSync('Pushr data request response') 
	self.infoSync(results)
   if(e) return reject(e,null)
 
   resolve(results)


} 