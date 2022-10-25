



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
             
          
            self.saveDeviceToken(user.payload)
			.then((saved)=>{

                console.log('SaveDeviceTokenStatus',saved)
                if(saved) return self.callback(null,{pushr: {message: 'Device has been successfully saved'}})
                return self.callback({actionStatus:false,message:'There was a server error saving a bookmark'})
			})
			.catch((e)=>self.callback(e,null))
              

              
          }
          break;
          case 'sendPushNotifications':{
              
              
              
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
		let pushr = pay.pushr
        const {email='',deviceToken="",os=""} = pushr
          
          
          if(!email) return reject(new Error('email key is required'))
          if(!deviceToken) return reject(new Error('deviceToken key is required'))

        self.getToken(email).then((foundToken)=>{

            if(!foundToken){
                let query = {
                      
                    fields: ['id','email','device_token','os'],
                    values: [null,email,deviceToken,os]
                      }
        
               
                  
              
              
                  self.query(
                          'mysql.pushr_tokens.insert',
                            query,
                            self.dataRequestHandler.bind(this,resolve,reject)
                      )
                      
            }else{

                self.updateToken(deviceToken).then((updatedToken)=>{

                    return resolve(updatedToken)

                }).catch((e)=>{

                    return reject(e)
                })
            }

        }).catch((e)=> reject(e))


        
      
      
      })
  



	
	
}
  export const sendPushNotification = function(pay){
  
      const self = this 
  
      return new Promise((resolve,reject)=>{
  
  
          let {postID} = blog
          let postKey = typeof postID === 'number' ? 'id' : 'slug'
  
          self.emit({
              type:'do-blogr-task',
              data:{
  
                  blog: {
                      keys:['title','id','body','post_quote','post_topic_name','slug','author','image','created_at'],
                      postID:{[postKey]: postID},
                      table: 'jo_blog_post',
                      action: 'getBlogPost',
                  },
                  callback: self.hookFunkToThingy(self,(resolve,reject,e=null,res=null)=>{
                          
                      self.infoSync('Get blogPost response RESPONSE')
                      self.infoSync(e)
                      self.infoSync(res)
                      if(e) return reject(e) 
                      const post = res[0]
  
                      self.emit({
                          type:'do-blogr-task',
                          data:{
          
                              blog: {
                                  keys:['title','id','body','post_quote','post_topic_name','slug','author','is_primary','image','created_at'],
                                  table: 'jo_blog_post',
                                  condition: [`post_topic_name EQUALS ${post.post_topic_name}`],
                                  skip: 1,
                                  limit: 4,
                                  action: 'getBlogPosts',
                              },
                              callback: self.hookFunkToThingy(self,(reso,reje,e=null,res=null)=>{
  
                                  self.infoSync('Get blogPost response RESPONSE')
                                  self.infoSync(e)
                                  self.infoSync(res)
                                  if(e) return reso({post: post,related: []}) 
                                  if(res.length === 0) return reso({post: post,related: []}) 
  
                                  res = [...res[0]]
  
                                  let filteredPosts = res.filter((po,i)=>{
  
                                      if(po[postKey].trim() !== postID.trim()) return true
                                  })
                                  return reso({post: post,related: [...filteredPosts]}) 
  
  
  
  
  
                              },[resolve,reject])
                          }
                          })
  
  
                      
              
  
              
              },[resolve,reject]) // hoofFunkToThingy end
              
              }// End of data
              })
  
          
      })
        
         
      
    
  }

  export const getToken = function(email){
	
	
	return new Promise((resolve,reject)=>{
		
		
		const self = this 
		const pao = self.pao 
		// let uid = pay.ID
		
		
		
		let queries = {

			returnFields: ['*'],
			conditions: [`email EQUALS ${email}`]
		 }
		
	
		self.query(
				'mysql.jo_job_bookmark.find',
				queries,
				self.multiDataRequestHandler.bind(this,resolve,reject)
			)
			
		
	})

}

export const updateToken = function(email,token){
	
	
	return new Promise((resolve,reject)=>{
		
		
		const self = this 
		const pao = self.pao 
		let uid = pay.ID
		
		
		
		let query = 
					{
				
					//tables:[table],
					condtions: [`email ISEQUALS ${email}`],
					set: {device_token: token}
				}

            self.query(
                `mysql.${table}.update`,
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