import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { FoodieService } from '../service/foodie.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  responseData:any;
  public uploadedImage:any=File;

  constructor(private fb:FormBuilder,
    private userService:UserService,
    private _sanckBar:MatSnackBar,
    private loginStatus:LoginService,
    private router:Router,
    private foodieSer:FoodieService){}

  registrationForm = this.fb.group({
    email:["",[Validators.required,this.checkIfGuestEmailsAreValid]],
    password:["",[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$/)]],
    confirmPassword:["",[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$/)]],
    name:["",[Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z]+$')]],
    phoneNo:["",[Validators.required,Validators.pattern(/^[789]\d{9,9}$/)]]
    // userImg:[""]
  },{validators:[this.passMustMatchValidator]})

  get email(){
    return this.registrationForm.get('email');
  }

  get password(){
    return this.registrationForm.get('password');
  }

  get confirmPassword(){
    return this.registrationForm.get('confirmPassword');
  }

  get name(){
    return this.registrationForm.get('name');
  }

  get phone(){
    return this.registrationForm.get('phoneNo');
  }

  checkIfGuestEmailsAreValid(c: AbstractControl) {
 
    if (c.value !== '') {
      const emailString = c.value;
      const emails = emailString.split(',').map((e: string) => e.trim());
      // const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(gmail\.com|yahoo\.com)$/i;
      const anyInvalidEmail = emails.every((e: string) => e.match(emailRegex) !== null);
      if (!anyInvalidEmail) {
        return { checkIfGuestEmailsAreValid: false }
      }
    }
    return null;
  }

  passMustMatchValidator(match:AbstractControl){
    const passwordValue = match.get('password')?.value
    const confirmPass = match.get('confirmPassword')?.value
    if(!passwordValue || !confirmPass){
      return null;
    }
    if(passwordValue != confirmPass){
      return { mustMatch: false }
    }
    return null;
  }

  public onImageUpload(event:any) {
   const userImg = event.target.files[0];
    console.log(userImg);
    this.uploadedImage = userImg;
    
  }

  addUser(){
    // console.log(this.registrationForm.get('phoneNo'));
    
    const userData = this.registrationForm.value;
    const fData = new FormData();
    // form data alway supports string file
    fData.append('userData', JSON.stringify(userData));
    fData.append('file',this.uploadedImage);
      

    this.userService.registerUser(fData).subscribe({
      next:data=>{

        let body="";
        const userName = String(this.name?.value);
        localStorage.setItem('name',userName);
        
        
        body = `${this.name?.value} Your accout with Foodie is created Successfully`;

        const userEmail:any=JSON.stringify(this.registrationForm.value.email);
        this.foodieSer.sendMail(userEmail,"Account Crearted",body).subscribe(()=>{
          console.log("email sent");
        },(error)=>{
          console.log("email not sent");
        })


        const userPhone = this.registrationForm.value.phoneNo;
        console.log("mobile number : "+userPhone);
        
        this.foodieSer.sendSms(`+91${userPhone}`,body).subscribe({
          next:data=>{
            console.log("acount Created Sms");
            
          }
        });

        console.log(data);
        this._sanckBar.open('Account created successfully.....', 'success', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'blue']
        });

       
       

        this.loginStatus.loginSuccess();
        this.router.navigateByUrl("/login")
      },error(err) {
        alert("Something Went Wrong")
      },
    })
  }
  
}
