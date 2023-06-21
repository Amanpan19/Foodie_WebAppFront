import { EventEmitter, Injectable } from '@angular/core';
import { FoodieService } from './foodie.service';
import { Item } from '../model/item';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn:boolean=false;
  searchElement:EventEmitter<string>=new EventEmitter();
  cartCount:EventEmitter<number>=new EventEmitter();
  homePresent:EventEmitter<boolean>=new EventEmitter();

  constructor(private foodie:FoodieService) { }

  loginSuccess(){
    this.isLoggedIn=true;
  }
  onFailure(){
    this.isLoggedIn=false;
  }

  getLoginStatus(){
    return this.isLoggedIn;
  }

  findCartCount(){
    this.foodie.getItems("incart",localStorage.getItem('email')).subscribe((response:Item[])=>{
      let items:Item[]=response;
      let count=0;
      items.map(item=>{
        if (item.count !== undefined) {
          count += item.count;
        }
       });
      this.cartCount.emit(count);
    },(error)=>{
      // console.error('Error retrieving items:', error);
      this.cartCount.emit(0);
    })
  }
}
