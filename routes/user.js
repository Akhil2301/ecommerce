
var express = require('express');
const { Db } = require('mongodb');
//const { MongoClient } = require('mongodb');
const productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helper');
var router = express.Router();
//var mongodb=require('mongodb').MongoClient


const accountSid = "AC55b870c0d8c96e1ff76e84c585db02db";
const authToken ="b824df7dfca1175e2566ff673afc6858";
const serviceid="VA8c4913d5591c069a8a6d6d49bbf7162c";
const client = require('twilio')(accountSid, authToken);




const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next();
    console.log('verified')
  }
  else{
    res.redirect('/login')
  }
}


const cartcnt =(req,res,next)=>{
  let user= req.session.user
  let cartCount=null;
  if (req.session.loggedIn){
    userHelper.getCartCount(req.session.user._id).then((response)=>{
      
      req.session.cartCount=response
      next();
    })
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user= req.session.user
  let cartCount=null;
  if (req.session.loggedIn){
    cartCount=await userHelper.getCartCount(req.session.user._id)
  }
  

  productHelpers.viewproduct().then(product=>{
    if (req.session.loggedIn){

      res.render('user/view-product', { product,cartCount, user});
      
    }
    else if(req.session.loggedInadmin){
      res.redirect('/admin')
    }
    else{
      res.render('user/view-product', { product, user});
    }
    

  })
});

router.get('/login',(req,res)=>{
//  if(req.session.loggedIn){
//   if(req.session.loggedInadmin){    
//     res.redirect('/admin')
//   }else{
//    // res.redirect('/')
//    if(req.session.loggedInadmin){          
//       res.redirect('/admin')
//    }
//    else{
//      res.redirect('/')    
//    }


//   }
   
//    }
if (req.session.loggedIn){         
  res.redirect('/')        
}
else if(req.session.loggedInadmin){
res.redirect('/admin')  
}
 else{      
  res.render('user/login',{err_msg:req.session.loggedErr})
 }
 
})

router.post('/login',(req,res)=>{
  
  userHelper.doLogin(req.body).then((response)=>{

    if(response.status){     
    req.session.user=response.user 

     mydata=response.user     

     if(mydata.role=='admin' ) {
      req.session.loggedInadmin=true
      
      res.redirect('/admin')
     }

     else if(mydata.role=='user' && mydata.status== true){
      req.session.loggedIn=true        
      res.redirect('/')           
      }
      else{
        req.session.loggedErr=true
        res.redirect('/login') 
      }
    }


    else{   
      if (req.session.loggedIn){         
          res.redirect('/')        
       }
       else if(req.session.loggedInadmin){
        res.redirect('/admin')  
       }
       else{
         req.session.loggedErr=true
        res.redirect('/login') 
       }
     
    }
  })
  
})




router.post('/signup',(req,res)=>{
  
 client.verify.services(serviceid)
  .verifications
  .create({to: `+91${req.body.phone}`, channel: 'sms'})
  .then(verification => res.render('user/otp',{name_body:req.body})
);

})


router.post('/otp',(req,res)=>{
 
  client.verify.services(serviceid)
      .verificationChecks
      .create({to: `+91${req.body.phone}`, code: req.body.OTP})
      .then((verification_check) =>{
        userHelper.doSignup(req.body).then((response)=>{
          
          if(response.message){
            res.render('user/signup',{err_msg:response.message})
          }else{
            
           
            userHelper.doLoginotp(req.body).then((response)=>{

              if(response.status){     
              req.session.user=response.user 
          
               mydata=response.user     
          
               if(mydata.role=='admin') {
                req.session.loggedInadmin=true
                
                res.redirect('/admin')
               }
          
               else if(mydata.role=='user'){
                req.session.loggedIn=true  
                
                res.redirect('/')           
                }
              }
          
          
              else{   
                if (req.session.loggedIn){         
                    res.redirect('/')        
                 }
                 else if(req.session.loggedInadmin){
                  res.redirect('/admin')  
                 }
                 else{
                   req.session.loggedErr=true
                  res.redirect('/login') 
                 }
               
              }
            })

      
          }
        })
      })
      .catch((error)=>{
        res.render('user/signup',{err_msg:"Invalid Otp"})
      });
  
})



router.get('/signup',(req,res)=>{
  res.render('user/signup')
})



router.get('/logout',(req,res)=>{
  req.session.destroy()

  res.redirect('/')
})




// router.post('/submit',function(req,res){ 
  
//   console.log(req.body);
//   mongodb.connect('mongodb://127.0.0.1:27017',function(err,client){
//     if(err){
//       console.log('eroor')
//     }
//     else{
//       //console.log('database connected');
//       client.db('mywebne').collection('user').insertOne(req.body);
//     } 
//   })
// })

/******************* Item Detailed Section  ***************************/
router.get('/product-detailed/:id',verifyLogin,cartcnt ,async(req,res)=>{
  cartCount=req.session.cartCount
      let product=await productHelpers.getProductDetails(req.params.id)
      let user=req.session.user
      let category=await userHelper.viewcategory()
      let subcategory=await userHelper.viewsubcategory()
     
      res.render('user/product-detail',{product,category,subcategory,user,cartCount});
 
})

/******************* Item Detailed End  ***************************/


/******************* Item add To cart ***************************/

router.get('/add-to-cart/:id',cartcnt,(req,res)=>{
  cartCount=req.session.cartCount
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    //res.redirect('/cart')
    res.json({status:true,cartCount})
  })

})

router.get('/cart',verifyLogin,cartcnt, async(req,res)=>{
 cartCount=req.session.cartCount
 let user=req.session.user


let products=  await userHelper.getCartProducts(req.session.user._id)
let totalamount=0

if(!products[0]){
   totalamount=0
  
}
else{
 totalamount =await userHelper.getTotalAmount(req.session.user._id)
 
}

 

let address=await userHelper.getAddress(req.session.user._id)
  res.render('user/cart',{products,users:req.session.user._id,cartCount,user,totalamount,address})

})
/******************* Item add To cart end***************************/

/*******************Change product quantity********** */
router.post('/change-product-quantity',cartcnt,(req,res,next)=>{
  
  userHelper.changeProductQuantity(req.body).then(async(response)=>{
    response.totalamount=await userHelper.getTotalAmount(req.body.user)
    //  return new Promise((resolve,reject)=>{
       res.json(response)
    // })
  })
})

/*******************Change product quantity End ********** */

/*******************Remove product ********** */
router.post('/remove-product',cartcnt,(req,res,next)=>{
  
  userHelper.removeProduct(req.body).then((response)=>{
    return new Promise((resolve,reject)=>{
       res.json(response)
    })
  })
})

/*******************remove product  End ********** */

/*******************place order ********** */
router.post('/place-orders',verifyLogin,cartcnt,async(req,res)=>{
console.log(req.body.selectAddress)
  // const addressid=req.body.addressid
  cartCount=req.session.cartCount  
   let totalamount=await userHelper.getTotalAmount(req.session.user._id)
   let address=await userHelper.getAddressbyid(req.body.selectAddress)
  


 res.render('user/checkout',{totalamount,cartCount,user:req.session.user,address})
 
 
})

/*******************place order end ********** */

/*******************address form ********** */
router.get('/add-address',cartcnt,verifyLogin,async(req,res)=>{
  let totalamount=await userHelper.getTotalAmount(req.session.user._id)
 
  res.render('user/addadress',{totalamount,cartCount,user:req.session.user});
  

})

/*******************adress form end ********** */


/*******************address form post ********** */
router.get('/add-address',cartcnt,verifyLogin,(req,res)=>{
 
userHelper.addadress(req.body).then(async(response)=>{   
 cartCount=req.session.cartCount
 let user=req.session.user
 let form1='open'
let products=  await userHelper.getCartProducts(req.session.user._id)
let totalamount=await userHelper.getTotalAmount(req.session.user._id)
let address=await userHelper.getAddress(req.session.user._id)
  res.render('user/cart',{products,users:req.session.user._id,cartCount,user,totalamount,address,form1})
  })


})

/*******************adress form end ********** */

router.post('/place-order',async(req,res)=>{

  let products=await userHelper.getCartProductList(req.body.userId)
  let totalPrice=await userHelper.getTotalAmount(req.body.userId)
  userHelper.placeOrder(req.body,products,totalPrice).then((response)=>{
    return new Promise((resolve,reject)=>{
       res.json({status:true})
    })
  })
  console.log(req.body)
})


router.get('/order-success',cartcnt,verifyLogin,(req,res)=>{
  cartCount=req.session.cartCount
  res.render('user/order-success',{user:req.session.user,cartCount,status:'ok'})
})

router.get('/orders',cartcnt,verifyLogin,async(req,res)=>{
  cartCount=req.session.cartCount
  let orders=await userHelper.getOrderList(req.session.user._id)
  console.log(req.session.user._id)
  res.render('user/order-success',{user:req.session.user,cartCount,orders,status:'false'})
})

router.get('/userpage',cartcnt,verifyLogin,async(req,res)=>{
  cartCount=req.session.cartCount
  let address=await userHelper.getAddress(req.session.user._id)

  res.render('user/userpage',{user:req.session.user,cartCount,address})
})

router.get('/Editprofie/:id',cartcnt,verifyLogin,async(req,res)=>{
 
  cartCount=req.session.cartCount
    let userDetail=await userHelper.getUsertDetails(req.params.id)
    
    res.render('user/edit-profile',{user:req.session.user,userDetail,cartCount});
 
})

router.post('/edit-profile/:pid',cartcnt,verifyLogin,(req,res)=>{
  cartCount=req.session.cartCount
   
  userHelper.updateProfile(req.params.pid,req.body).then(async()=>{
    
    cartCount=req.session.cartCount
    let address=await userHelper.getAddress(req.session.user._id)
    let user=await userHelper.getUsertDetails(req.session.user._id)
    res.render('user/userpage',{user,cartCount,address})
    

  
  })
})

router.get('/Edit-Address/:id',cartcnt,verifyLogin,async(req,res)=>{
 
  cartCount=req.session.cartCount
    let userAddressDetail=await userHelper.getUsertAddressDetail(req.params.id)
    
    res.render('user/edit-Address',{user:req.session.user,userAddressDetail,cartCount});
 
})

router.post('/Edit-Address/:pid',cartcnt,verifyLogin,(req,res)=>{

  
  userHelper.updateProfileAddress(req.params.pid,req.body).then(async()=>{
    cartCount=req.session.cartCount
    let address=await userHelper.getAddress(req.session.user._id)
  
    res.render('user/userpage',{user:req.session.user,cartCount,address})
  
  })
})


router.get('/cancel-order/:pid',cartcnt,verifyLogin,(req,res)=>{
  
  userHelper.updateOrderStaus(req.params.pid).then(()=>{
    res.redirect('/user/order-success')

  
  })
})


router.get('/changepassword',cartcnt,verifyLogin,(req,res)=>{
  cartCount=req.session.cartCount
  res.render('user/change-password',{user:req.session.user,cartCount})
 
})

router.post('/changepassword',cartcnt,verifyLogin,async(req,res)=>{
  cartCount=req.session.cartCount    
   userHelper.chekChangePassword(req.session.user,req.body).then((response)=>{
    if (response.status){
    client.verify.services(serviceid)
    .verifications
    .create({to: `+91${req.session.user.phone}`, channel: 'sms'})
    .then(verification => res.render('user/otp-changepass',{name_body:req.body})
  ); 
   } 
   else{
    res.render('user/change-password',{err_msg:"Please Retry after sometimes"})
   }

   }).catch((error)=>{
    res.render('user/change-password',{err_msg:"Please Retry after sometimes"})
   })
 
 
})


router.post('/changepass',cartcnt,verifyLogin,(req,res)=>{

  client.verify.services(serviceid)
      .verificationChecks
      .create({to: `+91${req.session.user.phone}`, code: req.body.OTP})
      .then((verification_check) =>{
  userHelper.changepass(req.body,req.session.user._id).then(async(response)=>{
    cartCount=req.session.cartCount
    let address=await userHelper.getAddress(req.session.user._id)
    
    res.render('user/userpage',{user:req.session.user,cartCount,address})
  })
})
})
module.exports = router; 

