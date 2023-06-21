import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantServiceService } from '../service/restaurant-service.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent {

  constructor(private fb:FormBuilder,private service:RestaurantServiceService,private route:Router){}

  role = localStorage.getItem("role");

  userLoggedIn?:string;
  restaurants:any=[];

  addform = this.fb.group({
    restaurantId: ['', Validators.required],
    restaurantName: ['', Validators.required],
    imageUrl: ['', Validators.required],
    location: ['', Validators.required],
    rating: ['', Validators.required]
  });
  

addRestaurant(){
  if(this.role === "adminRole"){
    if(this.addform.valid){
      this.service.addRestaurant(this.addform.value).subscribe(
        response=>{
          alert(`restaurant is added successfully`);
          this.service.updated.emit(true);
          this.addform.reset();
        },
        error=>{
          alert('add all the particulars');
        }
      )
    }
  }else{
    alert("You are not authorized to add or delete ");
  }
  
}

update(){
  if(this.addform.valid){  
      this.service.updateRestaurant(this.addform.value,this.addform.value.restaurantId).subscribe(
        response=>{
          alert(`restaurant has been updated`);
          this.service.updated.emit(true);
          this.addform.reset();
        },
        error=>{
          alert(`update is not possible`);
        }
      )    
  }
}

view(){
  this.route.navigateByUrl('/restaurantView')
}

addItem(){
  const id=1;
  this.service.getId(id);
  this.addform.reset();
  this.route.navigateByUrl('/adminAddItem');
}

}

