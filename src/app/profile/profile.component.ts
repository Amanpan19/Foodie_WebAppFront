import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userImg:SafeUrl='';
  userInfo:any;
  visible:boolean=false;

constructor(private userService:UserService,private sanitizer:DomSanitizer,private dialog:MatDialog,private login:LoginService){}

  ngOnInit(): void {
    if(this.login.isLoggedIn){
      if(localStorage.getItem('role')=="user"){
        this.visible=true
      }
    }
    this.userService.getProfileImg().subscribe((data: any) => {
      if(data && data.imageData){
        const imageData = data.imageData;
        const binaryData = atob(imageData);  // atob() function is used to decode the base64-encoded string into binary data.
        const arrayBuffer = new ArrayBuffer(binaryData.length); // creates a arrayBuffer of equal Length of binaryData
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/png' });
        this.userImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
    });

    this.userService.getUserDetails().subscribe((data:any)=>{
        this.userInfo=data;
        console.log(this.userInfo);
        
    })
    
  }

  updateUser(){
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width:'auto',
    });
}
}
