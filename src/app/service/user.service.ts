import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favourites } from '../model/favourites';
import { Address } from '../model/address';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }

  authUrl:String="http://localhost:8081/api/v1/auth";
  userUrl:String="http://localhost:8081/api/v1/userService";

  addressChanged:EventEmitter<boolean>=new EventEmitter();
  

  public userInfo:any={};

  login(loginData:any){
    console.log(loginData);
    
    return this.httpClient.post(`${this.authUrl}/login`,loginData);
  }

  registerUser(formData:FormData):Observable<any>{
    
     return this.httpClient.post(`${this.userUrl}/register/user`,formData);
  }

  updateUser(formData:FormData){
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    console.log(reqOption);
    console.log(formData);
    
    return this.httpClient.put(`${this.userUrl}/update/user`,formData,reqOption)
  }

  getProfileImg(){
    // const uEmail = localStorage.getItem('email');
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    console.log(reqOption);

    // return this.httpClient.get(`${this.userUrl}/get/profile?email=${uEmail}`);
    return this.httpClient.get(`${this.userUrl}/get/profile`,reqOption);
  }

  getUserDetails(){
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    console.log(reqOption);
    return this.httpClient.get(`${this.userUrl}/getName`,reqOption)
  }

  addItemToFavourites(itemData:any){
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    console.log(reqOption);
    return this.httpClient.post(`${this.userUrl}/add/item`,itemData,reqOption)
  }

  getListOfFavourites():Observable<Array<Favourites>>{
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    
    return this.httpClient.get<Array<Favourites>>(`${this.userUrl}/get/user/favourite`,reqOption)
  }

  removeFavourite(itemRemoved:any){
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    
    return this.httpClient.delete(`${this.userUrl}/remove/favourite?itemId=${itemRemoved}`,reqOption);
  }

  checkList(itemId:number):Observable<boolean>{
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    return this.httpClient.get<boolean>(`${this.userUrl}/check/list?itemId=${itemId}`,reqOption)
  }

  changeAddress(address:Address){
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    return this.httpClient.post(`${this.userUrl}/add/address`,address,reqOption)
  }
  getAddress():Observable<Address|any>{
    let httpHeader = new HttpHeaders({
      "Authorization":"Bearer "+localStorage.getItem('Token')
    });
    let reqOption  = {headers:httpHeader}
    return this.httpClient.get(`${this.userUrl}/get/address`,reqOption)
  }
}

