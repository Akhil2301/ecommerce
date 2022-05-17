var db = require('../config/config');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');

var objectId = require('mongodb').ObjectId


module.exports = {
    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            let key = "OTP"
            delete userData[key];
            const imUser = {
                ...userData,
                role: 'user',
                status: true
            }
            // /gg

            return new Promise(async (reso, rej) => {

                let respon = {}
                let userin = await db.get().collection(collection.USER_COLLECTION).findOne({email: userData.email});


                if (! userin && ! imUser.fname == '' && ! imUser.lname == '' && ! imUser.password == '' && ! imUser.phone == '' && ! imUser.email == '') {


                    db.get().collection(collection.USER_COLLECTION).insertOne(imUser).then((data) => { // console.log(data);
                        resolve(data.insertedId.toString());
                    }).catch((err) => {
                        console.log('error' + err);
                    })

                } else {
                    if (imUser.fname == '' || imUser.lname == '' || imUser.password == '' || imUser.phone == '' || imUser.email == '') {
                        resolve({message: 'Please Fill Correctly'})

                    } else {
                        resolve({message: 'Alredy have an accoount with this user name'})
                    }

                }


            })

        })

    },
    doLogin: (userData) => {

        return new Promise(async (resolve, reject) => {

            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email: userData.email});
            console.log(user)
            if (user) {

                return new Promise(async (reso, rej) => {
                    let rep = await bcrypt.compare(userData.password, user.password)

                    if (rep) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({status: false})
                    }
                })
            } else {
                resolve({status: false})

            }
        })
    },

    viewuser: (pro) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.USER_COLLECTION).find({role: 'user'}).toArray();
            resolve(products)
        })
    },

    deleteUser: (proid) => {
        // return new Promise((resolve,reject)=>{

        //     db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(proid)}).then((response)=>{
        //         resolve(response)
        //     })
        // })

        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({
                _id: objectId(proid)
            }, {
                $set: {
                    status: false
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    unblockUser: (proid) => {
        // return new Promise((resolve,reject)=>{

        //     db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(proid)}).then((response)=>{
        //         resolve(response)
        //     })
        // })

        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({
                _id: objectId(proid)
            }, {
                $set: {
                    status: true
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    getUsertDetails: (proid) => {
        return new Promise((resolve, reject) => {
            
            db.get().collection(collection.USER_COLLECTION).findOne({_id: objectId(proid)}).then((response) => {
                resolve(response)
            })
        })
    },


    updateUser: (prodid, userDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({
                _id: objectId(prodid)
            }, {
                $set: {
                    fname: userDetails.fname,
                    lname: userDetails.lname,
                    phone: userDetails.phone
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    doLoginotp: (userData) => {

        return new Promise(async (resolve, reject) => {
            console.log(userData.email + "hi")

            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email: userData.email});

            if (user) {
                console.log(user + "hi")
                resolve({user, status: true})
            } else {
                resolve({status: false})

            }
        })
    },
    viewcategory: (pro) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();

            resolve(products)
        })
    },
    Category: (data) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(data).then((response) => {
                resolve(response)
                
            })

        })
    },
    getcategoryDetails: (proid) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id: objectId(proid)}).then((response) => {
                resolve(response)
            })
        })
    },
    updateCategory: (prodid, userDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({
                _id: objectId(prodid)
            }, {
                $set: {
                    Name: userDetails.Name

                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    deletecategory: (proid) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.CATEGORY_COLLECTION).remove({_id: objectId(proid)}).then((response) => {
                resolve(response)
            })
        })


    },
    viewsubcategory: (pro) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.SUB_COLLECTION).find().toArray();

            resolve(products)
        })
    },
    getsubcategoryDetails: (proid) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.SUB_COLLECTION).findOne({_id: objectId(proid)}).then((response) => {
                resolve(response)
            })
        })
    },
    subCategory: (data) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.SUB_COLLECTION).insertOne(data).then((response) => {
                resolve(response)
                console.log(response);
            })

        })
    },
    updatesubCategory: (prodid, userDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.SUB_COLLECTION).updateOne({
                _id: objectId(prodid)
            }, {
                $set: {
                    Name: userDetails.Name

                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    deletesubcategory: (proid) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.SUB_COLLECTION).remove({_id: objectId(proid)}).then((response) => {
                resolve(response)
            })
        })


    },
    getProductviaid: (id) => {
        return new Promise((resolve, reject) => {
            let product = db.get().collection(collection.PRODUCT_COLLECTIOS).findOne({_id: objectId(id)})
            resolve(product)
        })
    },
    addToCart: (prodId, userId) => {
        let proObj = {
            item: objectId(prodId),
            quantity: 1
        }

        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user: objectId(userId)})
            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == prodId)
                console.log(proExist);

                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({
                        user:objectId(userId),
                        'products.item': objectId(prodId)
                    }, {
                        $inc: {
                            'products.$.quantity': 1
                        }
                    }).then((response) => {
                        resolve()
                    })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({
                        user: objectId(userId)
                    }, {

                        $push: {
                            products: proObj
                        }

                    }).then((response) => {
                        resolve()
                    })
                }

            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {


        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
             
                {
                    $match: {
                        user: objectId(userId)
                    }
                },
                {
                    $unwind:'$products' 
                    
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                    
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTIOS,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                    
                }



            ]).toArray()
         
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user: objectId(userId)})
            if (cart) {
                count = cart.products.length
            }
            resolve(count);
        })
    },
    changeProductQuantity:(details)=>{
        
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)
        
       return new Promise((resolve,reject)=>{
       
           if(details.count==-1 && details.quantity==1){
              
            db.get().collection(collection.CART_COLLECTION).updateOne({ 
                _id:objectId(details.cart)
                
            },{
                $pull:{products:{
                    item:objectId(details.product)
                }}
            })
            .then((response) => {
                
                resolve({removeProduct:true})
            })


           }else{
               console.log('ikka')
            db.get().collection(collection.CART_COLLECTION).updateOne({
                _id:objectId(details.cart),
                'products.item': objectId(details.product)
            }, {
                $inc: {
                    'products.$.quantity':details.count
                }
            }).then((response) => {
                resolve({status:true})
            })
           }
           
       
       })
    },
    removeProduct:(details)=>{

        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)
        
       return new Promise((resolve,reject)=>{
        db.get().collection(collection.CART_COLLECTION).updateOne({
            _id:objectId(details.cart)
            
        },{
            $pull:{products:{
                item:objectId(details.product)
            }}
        }).then((response)=>{
            resolve({removeProduct:true})
        })

       })

    },
    getTotalAmount:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
             
                {
                    $match: {
                        user: objectId(userId)
                    }
                },
                {
                    $unwind:'$products' 
                    
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                    
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTIOS,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                    
                },
                {
                     $group:{
                        _id:null,
                        total:{
                            $sum:{$multiply:['$quantity','$product.price']}
                        }

                    }
                }



            ]).toArray()
           
            resolve(total[0].total)
        })
    },

    addadress:(data)=>{
        return new Promise(async (resolve, reject) => {
            if(data.check=='checked'){
                
                db.get().collection(collection.USER_ADDRESS_COLLECTION).updateMany({
                    userId: data.userId
                }, {
                    $set: {
                        check: 'uncheked'
    
                    }
                }).then((response) => {
                    db.get().collection(collection.USER_ADDRESS_COLLECTION).insertOne(data).then((response) => {
                        resolve(response)
                        
                    })
                })
            
            }
            else{
                db.get().collection(collection.USER_ADDRESS_COLLECTION).insertOne(data).then((response) => {
                    resolve(response)
                    
                })
            }
           

        })
    },
    getAddress:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let address = await db.get().collection(collection.USER_ADDRESS_COLLECTION).find({userId: userId}).toArray();
            
            resolve(address)
           
        })
    },
    getAddressbyid:(id)=>{

        return new Promise(async (resolve, reject) => {
            let address = await db.get().collection(collection.USER_ADDRESS_COLLECTION).findOne({_id: objectId(id)})
            
            resolve(address)
           
        })

    },

    placeOrder:(order,products,total)=>{
        return new Promise(async (resolve, reject) => {
            console.log(order,products,total)
            let status=order.paymentMethod==='COD'?'Placed':'Pending';
            let orderObj={
                deliveryDetails:{
                        phone:order.phone,
                        address:order.address,
                        zip:order.zip
                },
                userId:objectId(order.userId),
                paymentMethod:order.paymentMethod,
                products:products,
                totalAmount:total,
                status:status,
                dat:new Date()
                
            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                db.get().collection(collection.CART_COLLECTION).remove({user:objectId(order.userId)})
                resolve(response)
            })
           
        })
    },
    getCartProductList:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user: objectId(userId)})
            
            resolve(cart.products)
           
        })
    },

    getOrderList:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({userId: objectId(userId)}).toArray()
             
            resolve(orders)
           
        })
    },
    updateProfile: (prodid, userDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({
                _id: objectId(prodid)
            }, {
                $set: {
                    fname: userDetails.fname,
                    lname: userDetails.lname,
                    phone: userDetails.phone
                    
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    getUsertAddressDetail: (proid) => {
        return new Promise((resolve, reject) => {
            
            db.get().collection(collection.USER_ADDRESS_COLLECTION).findOne({_id: objectId(proid)}).then((response) => {
                resolve(response)
            })
        })
    },

    updateProfileAddress: (prodid, userDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_ADDRESS_COLLECTION).updateOne({
                _id: objectId(prodid)
            }, {
                $set: {
                    address: userDetails.address,
                    city: userDetails.city,
                    zip: userDetails.zip
                    
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    
    updateOrderStaus: (proid) => {
       

        return new Promise((resolve, reject) => {

            db.get().collection(collection.ORDER_COLLECTION).updateOne({
                _id: objectId(proid)
            }, {
                $set: {
                    status: 'Cancelled'
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    chekChangePassword:(userData,changeuser) => {
 
        return new Promise(async (resolve, reject) => {          
            let response = {}
             let user = await db.get().collection(collection.USER_COLLECTION).findOne({_id: objectId(userData._id)});
            
            
            if (user) {
                return new Promise(async (reso, rej) => {
                    let checkcurentpassword = await bcrypt.compare(changeuser.password, user.password)
                    let newpassword = await bcrypt.compare(changeuser.npass, user.password)
                    if(checkcurentpassword!=newpassword){
                        response.user = user
                        response.status = true
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

    changepass:(newpass,userId)=>{
        return new Promise(async(resolve, reject) => {
            
            newpass.password = await bcrypt.hash(newpass.password, 10);
            
            db.get().collection(collection.USER_COLLECTION).updateOne({
                _id: objectId(userId)
            }, {
                $set: {                   
                    password: newpass.password
                    
                }
            }).then((response) => {
                resolve(response)
            })
        })
    }

}
