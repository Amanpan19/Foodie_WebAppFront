import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  responseData:any;
  userRole:any;
  constructor(private fb:FormBuilder,private userService:UserService,private _sanckBar:MatSnackBar,private route:Router,private loginStatus:LoginService){}

  loginForm = this.fb.group({
    email:["",[Validators.required,this.checkIfGuestEmailsAreValid]],
    password:["",[Validators.required,Validators.minLength(7)]]
  })

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password')
  }

  checkIfGuestEmailsAreValid(c: AbstractControl) {
 
    if (c.value !== '') {
      const emailString = c.value;
      const emails = emailString.split(',').map((e: string) => e.trim());
      const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(gmail\.com|yahoo\.com)$/i;
      const anyInvalidEmail = emails.every((e: string) => e.match(emailRegex) !== null);
      if (!anyInvalidEmail) {
        return { checkIfGuestEmailsAreValid: false }
      }
    }
    return null;
  }

  loginCheck(){
    // console.log(this.loginForm);
    
      this.userService.login(this.loginForm.value).subscribe({
        next:data=>{
          this.responseData=data;
          // console.log(this.responseData);
          
          localStorage.setItem('Token',this.responseData.Token);
          localStorage.setItem('role',this.responseData.role);
          localStorage.setItem('email',this.responseData.email);
        
          this.userRole = localStorage.getItem('role');
          console.log(this.userRole);
          
          if(this.userRole==="adminRole"){
            console.log("if");
            this.route.navigateByUrl('/admin');
            this.loginStatus.loginSuccess();
            this.loginStatus.getLoginStatus();
          }else{
            console.log("else");
          this.loginStatus.loginSuccess();
          this.loginStatus.getLoginStatus();
          this.route.navigateByUrl("");
          }

          this._sanckBar.open('Logged In successfully.....', 'success', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
        },error:(err)=>{
           this.loginStatus.onFailure()
          alert("Authorization failed, Please check the provided details again!")
        }
      })
  }
  showHidePass(){
  const password1 = document.getElementById('password') as HTMLInputElement;
  const toggler = document.getElementById('toggler') as HTMLElement;

  if(password1.type==='password'){
    password1.setAttribute('type','text');
    toggler.classList.add('fa-eye-slash');
  }
  else{
    toggler.classList.remove('fa-eye-slash');
    password1.setAttribute('type','password');
   }
  }
}
