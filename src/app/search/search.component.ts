import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  searchText:string ='';

  @Output()
  searchTextChanged = new EventEmitter<string>();

  searchLocation(){
    this.searchTextChanged.emit(this.searchText);
  }
   clearSearch(){
    this.searchText = "";
    this.searchTextChanged.emit(this.searchText);
   }



}
