



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
      self.infoSync('THE USER IN BLOGR&')
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
      const {payload} = user 
      const {blog={}} = payload
      const {topic='',archive=null} = blog
  
    
   switch(user.action){
  
          
          
          case 'saveDeviceToken': {
              
              // self.logSync('tHE PAYLOAD IS DeFINED')
              // self.logSync(user.payload)
  
              self.infoSync('THE topic')
              self.infoSync(blog)
              self.infoSync(topic)
          
              if(topic.trim()){
                  
                  
                  self.emit({
                      type:'do-blogr-task',
                      data:{
      
                          blog: {
                              keys:['title','id','body','post_quote','post_topic_name','slug','author','is_primary','image','created_at'],
                              table: 'jo_blog_post',
                              condition: [`post_topic_name EQUALS ${topic}`],
                              action: user.action,
                              limit: 10,
                              skip: 1
                              
                          },
                          callback: self.blogrDoHandler.bind(this)
                      }
                      })
  
              }else{
  
                  self.emit({
                      type:'do-blogr-task',
                      data:{
      
                          blog: {
                              keys:['title','id','body','post_quote','post_topic_name','slug','author','is_primary','image','created_at'],
                              table: 'jo_blog_post',
                              action: user.action,
                              limit: 5,
                              skip: 5
                          },
                          callback: self.blogrDoHandler.bind(this)
                      }
                      })
  
              }
              
          }
          break;
          case 'sendPushNotifications':{
              
              
              if(!contains(blog,['postID'])) return self.callback({message: 'missing required key'},null) 
  
              let {postID} = blog
              let postKey = typeof postID === 'number' ? 'id' : 'slug'
  
              self.emit({
                  type:'do-blogr-task',
                  data:{
  
                      blog: {
                          keys:['title','id','body','post_quote','post_topic_name','slug','author','image','created_at'],
                          postID:{[postKey]: postID},
                          table: 'jo_blog_post',
                          action: user.action,
                      },
                      callback: self.blogrDoHandler.bind(this)
                  }
                  })
          }
          break; 
  
       
          default: 
          self.callback(new Error('Unknown data request'),null)
          
          
      }
  
  
  
  }  
  
  
  
  export const getBlogPostWith = function(blog){
  
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
  
  
  
  export const hookFunkToThingy = function(hooky,hook,args = null){
        
         
      if(args){
          return hook.bind(hooky,...args)
      }else{
          return hook.bind(hooky)
      }
    
  }
  
  
  export const blogrDoHandler = function(e=null,results=null){
  
      const self = this 
      let pao = self.pao
  
      console.log('BLog data request response') 
     if(e) return self.callback({message:'blog fetching failed'},null) 
  
     self.infoSync('tHE BLOG HANDLER')
     self.infoSync(results)
  
     return self.callback(null,{blog: [...results[0]],totalPosts:results[1][0].totalPosts })
   
     
  
  
  } 