var express = require('express');
//const { MongoClient } = require('mongodb');
const productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helper');
var router = express.Router();
//var mongodb=require('mongodb').MongoClient


const accountSid = "AC55b870c0d8c96e1ff76e84c585db02db";
const authToken ="87c811ec64c2dca30f0b47bbf6c59b98";
const serviceid="VA8c4913d5591c069a8a6d6d49bbf7162c";
const client = require('twilio')(accountSid, authToken);



/* GET home page. */
router.get('/', function(req, res, next) {
  let user= req.session.user
  productHelpers.viewproduct().then(product=>{
    if (req.session.loggedIn){
      res.render('user/view-product', { product, user});
      
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
  console.log(req.body)
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
module.exports = router;

//const promise=require('promise');
// function add(num1,num2){
//     return new promise((resolve,reject)=>{
//        if(num1==0){
//             reject('first number is zero')
//        }

//         resolve(num1+num2)
//     })
// }
//  function multiply(num1,num2){
//    return new promise((resolve,reject)=>{
//      if(num1==0){
//        reject('first number is zero')
//      }
//      resolve(num1*num2);
//    })
//  }

//  function division(num1,num2){
//    return new promise((resolve,reject)=>{
//       if (num2==0){
//         reject('firstnum is zero')
//       }
//       resolve(num1/num2);
//    });
//  }
// add(10,20).then((sum)=>{
//     console.log(sum) 
//     return multiply(sum,sum)
// }).then((product)=>{
//    console.log(product)
//    return division(product,10)
// }).then((div)=>{
//   console.log(div);
// }
// )
// .catch((err)=>{
//     console.log(err)
// })

// function getName(){
//   return new promise((resolve,reject)=>{
//     setTimeout(()=>{
//       resolve('nikil')
//     },3000)
//   })
// }

// function getmobile(){
//   return new promise((resolve,reject)=>{
//     setTimeout(()=>{
//       resolve('9400149668')
//     },2000)

//   })
// }

// Promise.all([getName(),getmobile()]).then((result)=>{
// console.log(result);
// })

// async function getUser(){
//   let name=await getName();
//   console.log(name)
//   let mobile=await getmobile();
//   console.log(mobile);
// }
// getUser();
// console.log('hi')