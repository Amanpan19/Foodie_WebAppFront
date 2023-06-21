import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { RestaurantServiceService } from '../service/restaurant-service.service';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})
export class AddItemsComponent {
  userLoggedIn?:string;

  restaurantId:any;

  items:any =[]

  constructor(private fb:FormBuilder,private resService:RestaurantServiceService,private route:Router){}

  addform:any=this.fb.group({
    "itemId":['',Validators.required],
   "itemName" :['',Validators.required],
   "imageUrl":['',Validators.required],
   "description":['',Validators.required],
  "itemPrice":['',Validators.required],
  "itemRating":['',Validators.required]
})

addItem(){
  if(this.addform.valid){
    this.items.push(this.addform.value);
    this.resService.getId(this.restaurantId);
    this.resService.addItem(this.items,this.restaurantId).subscribe(
      response=>{
        alert("items are added successfully");
        this.route.navigateByUrl('/restaurantView');
      },
      error=>{
        alert("add all the details");
      }
    )
  }
 
}

view(){
  this.route.navigateByUrl("/viewAdminItem");
}
update(){
  if(this.addform.valid){
    this.resService.getId(this.restaurantId);
    this.resService.updateItem(this.addform.value,this.restaurantId).subscribe(
      response=>{
        alert("item have been updated");
        // this.route.navigateByUrl('/adminFoodItem');
      },
      error=>{
        alert("add all the items");
      }
    )
  }
}
}
