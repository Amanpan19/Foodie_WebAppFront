import { Component, Input, OnInit } from '@angular/core';
import { RestaurantServiceService } from '../service/restaurant-service.service';
import Typed from 'typed.js' 
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  present:boolean=true;
  constructor(private service:RestaurantServiceService, private login:LoginService){}
  ngOnInit(): void {
    this.login.findCartCount();
  //  const typed = new Typed('.typing',{      
  //                   //.typing is a target element // we, need to install Typed class from typed.js library
  //                  // npm install typed.js
  //   strings:['Hungry?','Cooking Gone wrong?','Game night?'],
  //   typeSpeed:100,
  //   backSpeed:60,
  //   loop:true
  //  })
  this.login.homePresent.subscribe(typeGet=>{
    
   this.present=typeGet;
   console.log(typeGet);
   
  })
  }
  ngAfterViewInit(): void {
    const typed = new Typed('.typing', {
      strings: ['Hungry?', 'Cooking Gone wrong?', 'Game night?'],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
    });
  }

    // restaurant:any=[];
    @Input('restaurants') restaurants:any[] = [];

    getLocation(location:any){
      this.getLocation(location);
      this.service.getRestaurantByLocation(location).subscribe(
        (response: Object) => {
          const restaurantArray = response as any[];
          if(location && location !== ''){
            this.restaurants = restaurantArray.filter((restaurant:any) => restaurant.location === location);
          } else {
            this.restaurants = restaurantArray;
            console.log(restaurantArray);
            
          }
        },
        error=>{
          alert("error!!!!");
        }
      )
    }
  
}
