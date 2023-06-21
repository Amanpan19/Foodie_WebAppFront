import { Component, OnInit } from '@angular/core';
import { RestaurantServiceService } from '../service/restaurant-service.service';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { Order } from '../model/order';
import { Item } from '../model/item';
import { FoodieService } from '../service/foodie.service';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.css']
})
export class ViewItemsComponent implements OnInit{
  constructor(private restaurant:RestaurantServiceService,
              private route:Router,
              private login:LoginService,
              private foodie:FoodieService,
              private userService:UserService,
              private _sanckBar:MatSnackBar){}
  addtocart!:Order;
  itemId!:boolean;
  data:number | undefined;
  restaurantItems:any=[];
  cartItems:any=[];
  favItems:any=[];
  isLoading:boolean=false;
  restaurantId!: number;
  ngOnInit(): void {
    this.login.findCartCount()
    this.data = 51;
    this.restaurantId = this.restaurant.id;
   
    if(this.login.isLoggedIn){
      const cartItems=this.initializeCartItems();
      const favItems=this.initializeFavItems();      
      
      Promise.all([cartItems,favItems]).then(()=>{
        this.restaurant.getAllItems(+this.restaurantId).subscribe((data:any)=>{      
          this.restaurantItems = data.map((item:any)=>{
            const cartItem=this.cartItems?.find((cartitem:any)=>cartitem.itemName===item.itemName);
            const inCart=cartItem?true:false;
            const favItem=this.favItems?.find((favitem:any)=>favitem.itemName===item.itemName);
            const inFav=favItem?true:false;
            const count = cartItem ? cartItem.count : 0;
            return {item,inCart,inFav,count};
          });
        });
      }).catch((error)=>{
        console.error("Error retrieving favItems or cartItems:", error);
      });
    }else{
      this.restaurant.getAllItems(+this.restaurantId).subscribe((data:any)=>{      
        this.restaurantItems =data.map((item:any)=>{
        const incart=false;
        const inFav=false;
        return {item,incart,inFav};
        });
      })
    }
  }

addToFavourites(itemData:any){  
    if(this.login.isLoggedIn){
      if(itemData.inFav){
          this.userService.removeFavourite(itemData.item.itemId).subscribe({
            next:data=>{
              this.ngOnInit();
              this._sanckBar.open(`${itemData.item.itemName} is removed from Favourites`, 'success', {
                duration: 3000,
                panelClass: ['mat-toolbar', 'mat-primary']
              });
            },error(err) {
                  alert("Not removed from favourites!");
            },
          })
      }else{
          this.userService.addItemToFavourites(itemData.item).subscribe({
            next:data=>{
              this.ngOnInit();
              this._sanckBar.open(`${itemData.item.itemName} is added on your Favourites`, 'success', {
                duration: 3000,
                panelClass: ['mat-toolbar', 'mat-primary']
              });
            },error(err) {
                  alert("Not added to favourites!");
            },
          })}
}else{
  this.route.navigateByUrl("/login");
}
}
          
addToCart(theItem:any){
  if(this.login.isLoggedIn){
    this.addtocart = new Order();
    this.addtocart.customerId = localStorage.getItem('email') ?? '';
    this.addtocart.billingAddress=localStorage.getItem("address")?? '';
    if (theItem) {
      theItem.status="incart";
      theItem.count=1;
      if (!this.addtocart.items) {
        this.addtocart.items = [];
      }
      this.addtocart.items = this.addtocart.items.concat(theItem);
      
      this.foodie.insertOrder(this.addtocart).subscribe(data=>{
        
        this.ngOnInit();
        this.route.navigateByUrl("/viewItem");
        this._sanckBar.open(`Item Added to Cart`, 'success', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      });
      }else
  this.route.navigateByUrl("/login");
}  else{this.route.navigateByUrl("/login");}
}


private initializeCartItems():Promise<void>{
  return new Promise((resolve,reject)=>{
    this.foodie.getItems("incart",localStorage.getItem('email')).subscribe(response=>{
      this.cartItems=response; 
      console.log(this.cartItems);
      resolve();
    },(error)=>{
      this.cartItems=[];
      resolve();
    });
  })  
}
private initializeFavItems():Promise<void>{
  return new Promise((resolve,reject)=>{
    this.userService.getListOfFavourites().subscribe((data:any)=>{
      this.favItems = data;
      resolve();
    },(error)=>{
      this.favItems=[];
      resolve();
    })
  })
 }


 remove(i?:Item){
  if(i!=null){
      i.status="incart";
      i.count=1;
    this.foodie.removeItem(localStorage.getItem('email'),i).subscribe(response=>{
      this.ngOnInit();
          });
  }
} 
 
add(i?:Item){
  if(i!=null){
      i.status="incart";
      i.count=1;
    this.foodie.addItem(localStorage.getItem('email'),i).subscribe(responce=>{
      this.ngOnInit();
    })
  }
}

}


// import { Component, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
// import { RestaurantServiceService } from '../service/restaurant-service.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { UserService } from '../service/user.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { LoginService } from '../service/login.service';
// import { FoodieService } from '../service/foodie.service';
// import { Order } from '../model/order';
// import { Favourites } from '../model/favourites';

// @Component({
//   selector: 'app-view-items',
//   templateUrl: './view-items.component.html',
//   styleUrls: ['./view-items.component.css']
// })
// export class ViewItemsComponent {
//   constructor(private restaurant:RestaurantServiceService,
//               private route:Router,
//               private userService:UserService,
//               private _sanckBar:MatSnackBar,
//               private login:LoginService,
//               private foodie:FoodieService){}

//   data:number | undefined;
//   itemNo:any;
//   addtocart!:Order;
//   userEmail:string="";
//   restaurantItems:any=[];
//   favItemId:any;
//   isClicked:boolean=false;
//   isLoading:boolean=true;
//   isAvail:boolean=false;

//   ngOnInit(): void {
//     this.data = 51;
//     this.restaurantId = this.restaurant.id;
//     this.restaurant.getAllItems(+this.restaurantId).subscribe(data=>{
      
//       this.restaurantItems = data;
//       console.log(this.restaurantItems);
//       this.isLoading=false;
      
//     })
//     this.getItems();
   
//   }

//   restaurants1:any=[];
//   restaurantId!: number;
// getItems() {

//         this.restaurant.getAllItems(+this.restaurantId).subscribe(data=>{
         
//           if(data!=null){
//             this.restaurantItems = data;
//             alert("avil");
            
//             this.isAvail=true;
//           }
//           else{
//             this.isAvail=false;
//             alert("empty");
            
//           }
          
          
//         })
//       }

// addToFavourites(itemData:any){
//   if(this.isClicked==false){
//     if(this.login.isLoggedIn){
//   itemData.isClicked=true;
//   this.userService.addItemToFavourites(itemData).subscribe({
//     next:data=>{
//       this._sanckBar.open(`${itemData.itemName} is added to your Favourites`, 'success', {
//         duration: 3000,
//         panelClass: ['mat-toolbar', 'mat-primary']
//       });
//     },error(err) {
//           alert("Not added to favourites!")
//     },
//   })
// }else{
//   this.route.navigateByUrl("/login")
// }
//   }
//   this.check(itemData.itemId);
// }

// check(itemId:any){
// this.userService.checkList(itemId).subscribe(data=>{
//   if(data==true){
//     if(this.isClicked){
//       this.isClicked=false;
//       this.userService.removeFavourite(itemId).subscribe({
//         next:data=>{
//           this._sanckBar.open(`Item Removed from favorites`, 'success', {
//             duration: 3000,
//             panelClass: ['mat-toolbar', 'mat-primary']
//           });
//         }
//       })
//     }
//     else{
//       this.isClicked=true;
//     }
//   }
// });
// }


          
// addToCart(theItem:any){
//   if(this.login.isLoggedIn){
//     this.addtocart = new Order();
//     this.userService.getUserDetails().subscribe((data:any)=>{
//       this.userEmail=data.email
//      });
//     this.addtocart.customerId =this.userEmail;
    
//     this.addtocart.billingAddress=localStorage.getItem("address")?? '';
    
//     if (theItem) {
//       console.log(theItem);
//       theItem.status="incart";
//       theItem.count=1;
//       if (!this.addtocart.items) {
//         this.addtocart.items = [];
//       }
//       this.addtocart.items = this.addtocart.items.concat(theItem);
      
//       this.foodie.insertOrder(this.addtocart).subscribe({
//         next:data=>{
//           console.log(data);
          
//           this._sanckBar.open('Item added to cart successfully.....', 'success', {
//             duration: 3000,
//             panelClass: ['mat-toolbar', 'mat-primary']
//           });
//         },
//         error(err) {
//           alert("Not Added")
//         },
//       });
//       }

// }

// }
// }
