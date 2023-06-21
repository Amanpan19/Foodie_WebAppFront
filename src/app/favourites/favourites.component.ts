import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { FoodieService } from '../service/foodie.service';
import { Order } from '../model/order';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit  {
  favList:any;
  addtocart!:Order;
  userEmail:string="";
  isLoading:boolean=true;
  dataPresent?:boolean;
  constructor(private userSer:UserService,private router:Router,private login:LoginService,private foodie:FoodieService,private _sanckBar:MatSnackBar ){}

  ngOnInit(): void {
    
    this.userSer.getListOfFavourites().subscribe({
      next:data=>{
        console.log(data);
        if(data!=null && data.length>0){
          this.favList = data;
          this.isLoading=false;
          this.dataPresent=true;
        }
        else{
          this.isLoading=false;
          this.dataPresent=false;
        }
      } 
    })
  }

  removeItem(itemData:any){
   this.userSer.removeFavourite(itemData).subscribe({
    next:data=>{
      this._sanckBar.open(`Item is removed from Favourites`, 'success', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });
      this.ngOnInit();
      this.router.navigateByUrl("/fav")
    }
   })
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
          this._sanckBar.open(`Item Added to Cart`, 'success', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
        });
        this.router.navigateByUrl("/cart")
        }
  }
  
  }

}
