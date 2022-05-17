

  /* image remove start */

$(document).ready(function() {
    if (window.File && window.FileList && window.FileReader) {
      $("#files").on("change", function(e) {
        var files = e.target.files,
          filesLength = files.length;
        for (var i = 0; i < filesLength; i++) {
          var f = files[i]
          var fileReader = new FileReader();
          fileReader.onload = (function(e) {
            var file = e.target;
            $("<span class=\"pip\">" +
              "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
              "<br/><span class=\"remove\">Remove image</span>" +
              "</span>").insertAfter("#files");
            $(".remove").click(function(){
              $(this).parent(".pip").remove();
            });
            
            // Old code here
            /*$("<img></img>", {
              class: "imageThumb",
              src: e.target.result,
              title: file.name + " | Click to remove"
            }).insertAfter("#files").click(function(){$(this).remove();});*/
            
          });
          fileReader.readAsDataURL(f);
        }
        console.log(files);
      });
    } else {
      alert("Your browser doesn't support to File API")
    }
  });

  /* image remove end */


  /* cart add and substract */



  function add(){
    let cartvallue=parseInt(document.getElementById('cartadd').value) ;
    
   if (cartvallue>0){
   
    document.getElementById('cartadd').value=cartvallue+1
  
    }
  
    else{
      document.getElementById('cartadd').value=1
    }

  }

  function substract(){
    let cartvallue=parseInt(document.getElementById('cartadd').value) 
    if (cartvallue>=2){
      document.getElementById('cartadd').value=cartvallue-1
      
    }
    else{
      document.getElementById('cartadd').value=1

    }
   

  }


  /* cart add and substract end*/


  /* cart ajax */
 

  function addtocart(proId){

 $.ajax({
     url:'/add-to-cart/'+proId,
     method:'get',
     success:(response)=>{
         if(response.status){
           let count=$('#cart-count').html()
           count=parseInt(count)+1
           $('#cart-count').html(count)
          
         }
     }
 })
}

/*cart ajaxe*/

function change(cartId,proId,userId,count){

let quantity=parseInt(document.getElementById(proId).value)
count=parseInt(count)
  $.ajax({
    url:'/change-product-quantity',
    data:{
      user:userId,
      cart:cartId,
      product:proId,
      count:count,
      quantity:quantity
    },
    method:'post',
  
    success:(response)=>{

     if(response.removeProduct){
      alert('remove item from cart')
       location.reload(); 

     }else{
       
      document.getElementById(proId).innerHTML=quantity+count
      document.getElementById('total').innerHTML=response.total
    
      location.reload()
     }
    }
  })
}


function substract(){
  let cartvallue=parseInt(document.getElementById('cartadd').value) 
  if (cartvallue>=2){
    document.getElementById('cartadd').value=cartvallue-1
    
  }
  else{
    document.getElementById('cartadd').value=1

  }
 

}


/* cart add and substract end*/


/* cart ajax */


function addtocart(proId){

$.ajax({
   url:'/add-to-cart/'+proId,
   method:'get',
   success:(response)=>{
       if(response.status){
         let count=$('#cart-count').html()
         count=parseInt(count)+1
         $('#cart-count').html(count)
        
       }
   }
})
}

/*cart ajaxe*/

function remove(cartId,proId,userId,count){
 
let quantity=parseInt(document.getElementById(proId).value)
count=parseInt(count)
$.ajax({
  url:'/remove-product',
  data:{
    user:userId,
    cart:cartId,
    product:proId,
    count:count,
    quantity:quantity
  },
  method:'post',

  success:(response)=>{

   if(response.removeProduct){
    alert('remove item from cart')
     location.reload();

   }
  }
})
}







  $("#checkout-form").submit((e)=>{
  
    e.preventDefault();
    $.ajax({
          url:'/place-order',
      method:'post',
      data:$('#checkout-form').serialize(),
      success:(response)=>{
        location.href='/order-success'
      }
    })
    })


    

    var currentLocation=location.href
    var menuItem=document.querySelectorAll('a');
    var menuLength=menuItem.length
    
   
    for(let i=0;i<menuLength;i++){
      
        if(menuItem[i].href===currentLocation){
            menuItem[i].className="active"
        }
    }
     /* nav highlight end */
document.getElementById('ok').click();

    