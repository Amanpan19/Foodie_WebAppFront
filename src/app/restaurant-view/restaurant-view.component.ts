import { Component, Input } from '@angular/core';
import { RestaurantServiceService } from '../service/restaurant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from '../model/order';
import { FoodieService } from '../service/foodie.service';

@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.css']
})
export class RestaurantViewComponent {
  isLoading:boolean=true;
  searchedItems:any=[];
  searchedRestaurants:any=[];
  present:boolean=false;
  addtocart!:Order;
  constructor(private service:RestaurantServiceService,
              private route:Router,
              private login:LoginService,
              private userService:UserService,
              private foodie:FoodieService,
              private _sanckBar:MatSnackBar){
  }
  ngOnInit(): void {
    this.service.getAllRestaurant().subscribe(
      response=>{
        this.restaurants=response;
        this.isLoading = false;
       }
    )
    this.login.searchElement.subscribe(seachelement=>{
      this.onSearchTextChanged(seachelement);
    })
  
  }

  getItems(id:number) {
    this.service.getId(id);
    this.route.navigateByUrl('/viewItem');
    }

    @Input('restaurants') restaurants:any = [];

    getLocation(location:any){
      this.getLocation(location);
      this.service.getRestaurantByLocation(location).subscribe(
        (response: Object) => {
          const restaurantArray = response as any[];
          if(location && location !== ''){
            this.restaurants = restaurantArray.filter((restaurant:any) => restaurant.location === location);
          } else {
            this.restaurants = restaurantArray;
            // console.log(restaurantArray);
            
          }
        },
        error=>{
          alert("error!!!!");
        }
      )
    }

    onSearchTextChanged(searchText:string) {
     
      
                this.route.navigateByUrl("");
                // this.route.navigateByUrl("/restaurantView");
                if (searchText && searchText.trim() !== '') {
                  this.present=true;
                  this.searchedItems = [];
                  this.restaurants.forEach((restaurant: any) => {
                    restaurant.items.forEach((item: any) => {
                      if (item.itemName.toLowerCase().includes(searchText.toLowerCase())) {
                        this.searchedItems.push(item);
                      }
                    });
                  });
                } else {
                  this.ngOnInit()
                  this.present=false;
                  this.searchedItems = [];
                }

                if(searchText || searchText !== ''){
                  this.present=true;
                  this.searchedRestaurants=this.restaurants.filter((restaurant:any)=>{
                      return restaurant.restaurantName.toLowerCase().includes(searchText.toLowerCase());
                    });
                }else{
                  this.present=false;
                  this.searchedRestaurants=[];
                  this.ngOnInit();
                }
                // console.log(this.searchedItems);
                // console.log(this.searchedRestaurants);
              }

    add(){
      this.route.navigateByUrl('/addRestaurant');
    }

    addToFavourites(itemData:any){
      itemData.isClicked=true;
      this.userService.addItemToFavourites(itemData).subscribe({
        next:data=>{
          this._sanckBar.open(`${itemData.itemName} is added to your Favourites`, 'success', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
        },error(err) {
              alert("Not added to favourites!")
        },
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
            this.ngOnInit();
            this.route.navigateByUrl("/cart");
            this._sanckBar.open(`Item Added to Cart`, 'success', {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-primary']
            });
            
          });
          }else
      this.route.navigateByUrl("/login");
    }  else{this.route.navigateByUrl("/login");}
    }
}
