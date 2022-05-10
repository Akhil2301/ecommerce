
var db=require('../config/config');
var collection=require('../config/collection');
const bcrypt=require('bcrypt');
var objectId=require('mongodb').ObjectId




module.exports={
    doSignup:(userData)=>{
       
        return new Promise(async(resolve,reject)=>{
            userData.password= await bcrypt.hash(userData.password,10);
            let key="OTP"
            delete userData[key];
            const imUser={...userData,role:'user',status:true}
       ///gg

       return new Promise(async(reso,rej)=>{
    
        let respon={}
        let userin=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email});

    
         if(!userin && !imUser.fname =='' && !imUser.lname=='' && !imUser.password=='' && !imUser.phone =='' && !imUser.email ==''){

    
            
            db.get().collection(collection.USER_COLLECTION).insertOne(imUser)
            .then((data)=>{
                //console.log(data);
                resolve(data.insertedId.toString());
            }).catch((err)=>{
                console.log('error'+err);
            })

         }
         else{
             if(imUser.fname =='' || imUser.lname=='' || imUser.password=='' || imUser.phone =='' || imUser.email ==''){
                resolve({message:'Please Fill Correctly'})
               
             }
             else{
                resolve({message:'Alredy have an accoount with this user name'})
             }
             
         }
            



        })
         
        }) 
       
    },
    doLogin:(userData)=>{
       
        return new Promise(async(resolve,reject)=>{
            
            let loginStatus=false;
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email});
                console.log(user)
              if(user){
               
                return new Promise(async(reso,rej)=>{
                    let rep=await bcrypt.compare(userData.password,user.password)
                    
                    if(rep){                        
                        response.user=user
                        response.status=true
                        resolve(response)
                    }
                    else{
                        resolve({status:false})                       
                    }
                })
            }
            else{
                resolve({status:false})
               
            }
        })
    },

    viewuser:(pro)=>{
        return new Promise(async (resolve,reject)=>{
            let products = await db.get().collection(collection.USER_COLLECTION).find({role:'user'}).toArray();
            resolve(products)
        })
    },

    deleteUser:(proid)=>{
        // return new Promise((resolve,reject)=>{
           
        //     db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(proid)}).then((response)=>{
        //         resolve(response)
        //     })
        // })

        return new Promise((resolve,reject)=>{

            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(proid)},{
                $set:{
                  status:false
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },unblockUser:(proid)=>{
        // return new Promise((resolve,reject)=>{
           
        //     db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(proid)}).then((response)=>{
        //         resolve(response)
        //     })
        // })

        return new Promise((resolve,reject)=>{

            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(proid)},{
                $set:{
                  status:true
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    getUsertDetails:(proid)=>{
        return new Promise((resolve,reject)=>{
            console.log('wait')
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })
    },



    updateUser:(prodid,userDetails)=>{
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(prodid)},{
                $set:{
                    fname:userDetails.fname,                    
                    lname:userDetails.lname,
                    phone:userDetails.phone
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    doLoginotp:(userData)=>{
       
        return new Promise(async(resolve,reject)=>{
            console.log(userData.email+"hi")
            
            let loginStatus=false;
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email});
                
              if(user){
                console.log(user+"hi")
                resolve({user,status:true})
            }
            else{
                resolve({status:false})
               
            }
        })
    },
    viewcategory:(pro)=>{
        return new Promise(async (resolve,reject)=>{
            let products = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();
           
            resolve(products)
        })
    },
    Category:(data)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(data).then((response)=>{
                resolve(response)
                console.log(response);
            })

        })
    },
    getcategoryDetails:(proid)=>{
        return new Promise((resolve,reject)=>{
           
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })
    }, 
    updateCategory:(prodid,userDetails)=>{
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:objectId(prodid)},{
                $set:{
                    Name:userDetails.Name,                    
                   
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    deletecategory:(proid)=>{
        return new Promise((resolve,reject)=>{
           
            db.get().collection(collection.CATEGORY_COLLECTION).remove({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })

       
    },
    viewsubcategory:(pro)=>{
        return new Promise(async (resolve,reject)=>{
            let products = await db.get().collection(collection.SUB_COLLECTION).find().toArray();
           
            resolve(products)
        })
    },
    getsubcategoryDetails:(proid)=>{
        return new Promise((resolve,reject)=>{
           
            db.get().collection(collection.SUB_COLLECTION).findOne({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    subCategory:(data)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.SUB_COLLECTION).insertOne(data).then((response)=>{
                resolve(response)
                console.log(response);
            })

        })
    }, 
     updatesubCategory:(prodid,userDetails)=>{
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.SUB_COLLECTION).updateOne({_id:objectId(prodid)},{
                $set:{
                    Name:userDetails.Name,                    
                   
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    deletesubcategory:(proid)=>{
        return new Promise((resolve,reject)=>{
           
            db.get().collection(collection.SUB_COLLECTION).remove({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })

       
    },
    getProductviaid:(id)=>{
        return new Promise((resolve,reject)=>{
            let product =db.get().collection(collection.PRODUCT_COLLECTIOS).findOne({_id:objectId(id)})
            resolve(product)
        })
    }
    
 


}


