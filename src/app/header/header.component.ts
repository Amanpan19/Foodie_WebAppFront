import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../service/user.service';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, startWith } from 'rxjs';
import { FoodieService } from '../service/foodie.service';
import { Item } from '../model/item';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  imageSrc:SafeUrl='';
  type:String="login";
  flag:boolean=true;
  flag1:boolean=false;
  adminLoggedIn:boolean=false;
  userInfo:any;
  isVisible:boolean =false;
  items:Item[]=[];
  cartCount:number=0;

  constructor(private userService:UserService,
              private sanitizer:DomSanitizer,
              private logSer:LoginService,
              private router:Router,
              private foodie:FoodieService){}

  
  ngOnInit(): void {
    if(this.logSer.isLoggedIn){
      this.logSer.findCartCount();
    }
    if(this.logSer.getLoginStatus()){
      
      if(this.type==="login"){
        this.type="logout"
      }
      this.flag=false;
      this.flag1=true;

      this.foodie.getItems("incart",localStorage.getItem('email')).subscribe(response=>{
        console.log(response);
        this.items=response; 
        // this.totalPrice();   
      },
      error =>{
        console.error('Error retrieving items:', error);
      });

      this.logSer.cartCount.subscribe((num)=>{
        this.cartCount = num;
      })


    this.userService.getProfileImg().subscribe((data:any)=>{
      if(data && data.imageData){
        const imageData = data.imageData;
        const binaryData = atob(imageData);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/png' });
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
    })

    this.userService.getUserDetails().subscribe((data:any)=>{
    this.userInfo = data;
    
    })

    if(localStorage.getItem('role')==="adminRole"){
      this.adminLoggedIn=false;
 }
 else{
   this.adminLoggedIn=true;
   
 }
  } 

  document.addEventListener("DOMContentLoaded",function(){
    window.addEventListener("scroll",function(){
      if(this.scrollY>120){
        document.querySelector('#navbar')?.classList.add("sticky");
      }
      else{
        document.querySelector('#navbar')?.classList.remove("sticky");
      }
    });
  });

  }

  clicked(){
    if(this.type==="logout"){
      // localStorage.clear();
      // this.adminLoggedIn=false;
      this.logSer.onFailure();
      this.router.navigateByUrl("/login")
      localStorage.clear();
      this.type="login"
      this.flag=true;
      this.flag1=false
        }
  }

  clickedList(){
    if(!this.isVisible){
      this.isVisible=true;
    }
    else{
      this.isVisible=false;
    }
  
  }
  onSearchTextChanged(searchText:string){
    this.logSer.searchElement.emit(searchText);
    if(searchText.length>0){
      this.logSer.homePresent.emit(false);
      console.log("if we get");
      
    }
    else {
      this.logSer.homePresent.emit(true);
      console.log("else we get");
    }
  }
  
  moveToHome(){
    this.ngOnInit();
    this.router.navigateByUrl("");
  }

}
