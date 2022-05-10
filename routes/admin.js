var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helper')

var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {
 
  productHelpers.viewproduct().then((products=>{
    //console.log(products);
    
    if(req.session.loggedInadmin){
       admininfo= req.session.user
     
      res.render('admin/view-products',{products,admininfo,admin:true});
    }
    else{
    
      res.render('user/login')
     
    }
    
  })).catch((err)=>{
    console.log(`error${err}`)
  })
 
});


router.get('/add-product',(req,res)=>{
  admininfo= req.session.user
  if(req.session.loggedInadmin){
   // res.render('admin/add-product',{admininfo,admin:true})
   userHelper.viewcategory().then(async(item)=>{
    let subitem=await userHelper.viewsubcategory(req.params.id)
    res.render('admin/add-product',{item,subitem,admin:true})
  })

  }
  else{
    res.render('user/login')
  }
  
})

router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body,(result)=>{
    let image=req.files.image;
  
    image.mv('./public/images/'+result+'.jpg',(err,done)=>{
      if(!err){
      
        admininfo= req.session.user
        res.render('admin/add-product',{admininfo,admin:true})
      }
      else{
        console.log(error);
      }
    })
  
  })
})


router.get('/user-list',(req,res)=>{
  admininfo= req.session.user

  userHelper.viewuser().then((userlist=>{
    console.log(userlist);
    
    if(req.session.loggedInadmin){
       admininfo= req.session.user
       res.render('admin/user-list',{userlist,admininfo,admin:true})
     
    }  
    else{ 
      res.render('user/login')
    }
    
  })).catch((err)=>{
    console.log(`error${err}`)
  })

  
})



router.get('/delete-product/:id',(req,res)=>{
  let proid=req.params.id
  
  productHelpers.deleteProduct(proid).then((response)=>{
    console.log('hi')
    res.redirect('/admin');
   
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  if(req.session.loggedInadmin){
    admininfo= req.session.user
    let product=await productHelpers.getProductDetails(req.params.id)

    let category=await userHelper.viewcategory()
    let subcategory=await userHelper.viewsubcategory()
  console.log(category)
    res.render('admin/edit-product',{product,category,subcategory,admininfo,admin:true});
  }
})


// router.post('/edit-product/:pid',(req,res)=>{
//   console.log('jiii')
//   productHelpers.updateProduct(req.params.pid,req.body).then(()=>{
//     res.redirect('/admin')

//     if(req.files.image){
//       let image=req.files.image;
  
//       image.mv('./public/images/'+req.params.pid+'.jpg')
//     }
//   })
// })


router.post('/edit-product/:pid',(req,res)=>{
  console.log('jiii')
  productHelpers.updateProduct(req.params.pid,req.body).then(()=>{
    res.redirect('/admin')
  
    // if(req.files.image){
    //   let image=req.files.image;
  
    //   image.mv('./public/images/'+req.params.pid+'.jpg')
    // }
  })
})



router.get('/delete-user/:id',(req,res)=>{
  let proid=req.params.id
  
  userHelper.deleteUser(proid).then((response)=>{
    
    res.redirect('/admin/user-list');
   
  })
})

router.get('/unblock-user/:id',(req,res)=>{
  let proid=req.params.id
  
  userHelper.unblockUser(proid).then((response)=>{
    
    res.redirect('/admin/user-list');
   
  })
})





router.get('/edit-user/:id',async(req,res)=>{
  if(req.session.loggedInadmin){
    admininfo= req.session.user
    let product=await userHelper.getUsertDetails(req.params.id)
    
    res.render('admin/edit-user',{product,admininfo,admin:true});
  }
})


router.post('/edit-user/:pid',(req,res)=>{
  
  userHelper.updateUser(req.params.pid,req.body).then(()=>{
    res.redirect('/admin/user-list')

  
  })
})



router.get('/category-list',(req,res)=>{
  admininfo= req.session.user

  userHelper.viewcategory().then((categorylist=>{
    console.log(categorylist);
    
    if(req.session.loggedInadmin){
       admininfo= req.session.user
       res.render('admin/category-list',{categorylist,admininfo,admin:true})
     
    }  
    else{ 
      res.render('user/login')
    }
    
  })).catch((err)=>{
    console.log(`error${err}`)
  })

  
})

router.get('/add-category',(req,res)=>{
  admininfo= req.session.user
  if(req.session.loggedInadmin){
    res.render('admin/add-category',{admininfo,admin:true})
  }
  else{
    res.render('user/login')
  }
  
})



router.post('/add-catagory',(req,res)=>{

  userHelper.Category(req.body).then((response)=>{
    res.redirect('/admin/category-list')
  })
})




router.get('/edit-category/:id',async(req,res)=>{
  if(req.session.loggedInadmin){
    admininfo= req.session.user
    let category=await userHelper.getcategoryDetails(req.params.id)
    
    res.render('admin/edit-category',{category,admininfo,admin:true});
  }
})


router.post('/edit-category/:pid',(req,res)=>{
  
  userHelper.updateCategory(req.params.pid,req.body).then(()=>{
    res.redirect('/admin/category-list')

  
  })
})
router.get('/delete-category/:id',(req,res)=>{
  let proid=req.params.id
  
  userHelper.deletecategory(proid).then((response)=>{
    
    res.redirect('/admin/category-list');
   
  })
})

router.get('/subcategory-list',(req,res)=>{
  admininfo= req.session.user

  userHelper.viewsubcategory().then((categorylist=>{
    console.log(categorylist);
    
    if(req.session.loggedInadmin){
       admininfo= req.session.user
       res.render('admin/subcategory-list',{categorylist,admininfo,admin:true})
     
    }  
    else{ 
      res.render('user/login')
    }
    
  })).catch((err)=>{
    console.log(`error${err}`)
  })

  
})

router.get('/add-subcategory',(req,res)=>{
  admininfo= req.session.user
  if(req.session.loggedInadmin){
    res.render('admin/add-subcategory',{admininfo,admin:true})
  }
  else{
    res.render('user/login')
  }
  
})


router.post('/add-subcatagory',(req,res)=>{

  userHelper.subCategory(req.body).then((response)=>{
    res.redirect('/admin/subcategory-list')
  })
})

router.get('/edit-subcategory/:id',async(req,res)=>{
  if(req.session.loggedInadmin){
    admininfo= req.session.user
    let category=await userHelper.getsubcategoryDetails(req.params.id)
    
    res.render('admin/edit-subcategory',{category,admininfo,admin:true});
  }
})


router.post('/edit-subcategory/:pid',(req,res)=>{
  
  userHelper.updatesubCategory(req.params.pid,req.body).then(()=>{
    res.redirect('/admin/subcategory-list')

  
  })
})

router.get('/delete-subcategory/:id',(req,res)=>{
  let proid=req.params.id
  
  userHelper.deletesubcategory(proid).then((response)=>{
    
    res.redirect('/admin/subcategory-list');
   
  })
})



router.get('/edit-image/:id',(req,res)=>{
  
  userHelper.getProductviaid(req.params.id).then((product)=>{
    res.render('admin/edit-image',{product,admin:true})
    

   
  })
})

router.post('/edit-image/:id',(req,res)=>{
 
  
    if(req.files.image){
      let image=req.files.image;
  
      image.mv('./public/images/'+req.params.pid+'.jpg')
    }
 
 
})
module.exports = router;
