import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestaurantServiceService {


  constructor(private http:HttpClient) { }

  resId: EventEmitter<number> = new EventEmitter();
  id:number=0;
  location:string='';
  baseUrl:string="http://localhost:8081/api/v1/restaurant";
  updated:EventEmitter<boolean>=new EventEmitter();

  getAllRestaurant(){
    return this.http.get(this.baseUrl+"/getRestaurant");
  }

  getAllItems(id:number){
    console.log(`Hi + ${id}`);
    return this.http.get(`${this.baseUrl}/getItems/${id}`);
    
  }

  getId(id:number){
    
    if(id){
      this.id = id;
      this.resId.emit(id);
    }
    console.log(id);
  }

  getLocation(location:string){
    this.location = location;
    console.log(location);
    
  }

  getRestaurantByLocation(location:string){
    // return this.http.get(`http://localhost:25500/api/v1/restaurant/getLocation/${location}`);
    return this.http.get(`${this.baseUrl}/getLocation/${location}`);
  }

  addRestaurant(addRestaurant:any){
    let httpHeader = new HttpHeaders({
      'Authorization':'Bearer ' +localStorage.getItem("Token")
    });
    console.log(localStorage.getItem("Token"));
    let requestOption = {headers:httpHeader}
    return this.http.post(`${this.baseUrl}/addRestaurant`,addRestaurant,requestOption);
    
  }

  updateRestaurant(updateRes:any,id:any){
    let httpHeader = new HttpHeaders({
      'Authorization':'Bearer ' +localStorage.getItem("Token")
    });
    let requestOption = {headers:httpHeader}
    return this.http.put(`${this.baseUrl}/update/${id}`,updateRes,requestOption);
  }

  deleteRestaurant(id:number){
    let httpHeader = new HttpHeaders({
      'Authorization':'Bearer ' +localStorage.getItem("Token")
    });
    console.log(localStorage.getItem("Token"));
    let requestOption = {headers:httpHeader}
    return this.http.delete(`${this.baseUrl}/delete/${id}`,requestOption);
  }


  addItem(addItem:any,id:number){
    console.log(`Hi + ${id}`);
    let httpHeader = new HttpHeaders({
      'Authorization':'Bearer ' +localStorage.getItem("Token")
    });
    let requestOption = {headers:httpHeader}
    return this.http.post(`${this.baseUrl}/addItem/${id}`,addItem,requestOption);
  }

  updateItem(updateItem:any,id:number){
    let httpHeader = new HttpHeaders({
      'Authorization':'Bearer ' +localStorage.getItem("Token")
    });
    let requestOption = {headers:httpHeader}
    return this.http.put(`http://localhost:8081/api/v1/restaurant/updateItem/${id}`,updateItem,requestOption);
  }

  deleteItem(deleteItem:any,id:number){
    console.log(`Hi + ${id}`);
    console.table(deleteItem);
    let httpHeader = new HttpHeaders({
      'Authorization':'Bearer ' +localStorage.getItem("Token")
    });
    // const deleteItems = deleteItem. 
    let requestOption = {headers:httpHeader}
    return this.http.post(`${this.baseUrl}/deleteItem/${id}`,deleteItem,requestOption);
  }
}
