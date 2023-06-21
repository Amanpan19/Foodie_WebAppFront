import { Component, OnInit,Inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  responseData:any;
  public uploadedImage:any=File;
  userName:string="";
  userPhone:any;
  fileName:string="";

  constructor(private fb:FormBuilder,
    private userService:UserService,
    private _sanckBar:MatSnackBar,
    public dialogRef:MatDialogRef<UpdateUserComponent>,
    private loginStatus:LoginService,@Inject(MAT_DIALOG_DATA) public dataX:any,
    private router:Router){}

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe((data:any)=>{
      this.userName = data.name;
      console.log(this.userName);
      
      this.userName = data.name;
      this.userPhone = data.phoneNo;

      this.updationForm.patchValue({
        name: this.userName,
        phoneNo: this.userPhone
      });
     })
  }

  updationForm = this.fb.group({
    
    name:['',[Validators.minLength(3)]],
    phoneNo:[null,[Validators.pattern(/^[789]\d{9,9}$/)]]
    
  })

  get name(){
    return this.updationForm.get('name');
  }

  get phone(){
    return this.updationForm.get('phoneNo');
  }

  public onImageUpload(event:any) {
   const userImg = event.target.files[0];
   console.log(userImg);
   if(userImg){
    this.uploadedImage = userImg;
    this.fileName = userImg.name;
   }
   else{
    this.uploadedImage = null;
    this.fileName="";
   }

  }

  updateUser(){

    const userData = this.updationForm.value;
    console.log(userData);
    
    const fData = new FormData();
    // form data alway supports string file
    fData.append('userInfo', JSON.stringify(userData));
    fData.append('file',this.uploadedImage);

    this.userService.updateUser(fData).subscribe({
      next:data=>{
        this.router.navigateByUrl("")
        this.dialogRef.close();
        this._sanckBar.open('Updated successfully.....', 'success', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'blue']
        });
        
      },error(err) {
        alert('not updated')
      },
    })
  }
  clear(){
    this.dialogRef.close();
  }

}
