import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddItemsComponent } from './add-items/add-items.component';
import { RestaurantViewComponent } from './restaurant-view/restaurant-view.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ViewItemsComponent } from './view-items/view-items.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardGuard } from './guard/auth-guard.guard';
import { UpdateUserComponent } from './update-user/update-user.component';
import { CartComponent } from './cart/cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminFoodItemsViewComponent } from './admin-food-items-view/admin-food-items-view.component';
import { AdminRestaurantViewComponent } from './admin-restaurant-view/admin-restaurant-view.component';
import { AdminComponent } from './admin/admin.component';
import { FooditemComponent } from './fooditem/fooditem.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  // {path:"header",component:HeaderComponent},
  {path:"registration",component:RegistrationComponent},
  {path:"login",component:LoginComponent},
  {path:"about",component:AboutUsComponent},
  {path:"header",component:HeaderComponent},
  {path:"myOrders",component:MyOrdersComponent,canActivate:[AuthGuardGuard]},
  {path:"cart",component:CartComponent,canActivate:[AuthGuardGuard]},
  {path:"profile",component:ProfileComponent,canActivate:[AuthGuardGuard]},
  {path:"update",component:UpdateUserComponent},
  {path:"",component:DashboardComponent},
  {path:"viewItem",component:ViewItemsComponent,canActivate:[AuthGuardGuard]},
  {path:"fav",component:FavouritesComponent,canActivate:[AuthGuardGuard]},
  {path:"restaurantView",component:RestaurantViewComponent},
  {path:"admin",component:AdminComponent,canActivate:[AuthGuardGuard]},
  {path:"adminFoodItemView",component:AdminFoodItemsViewComponent,canActivate:[AuthGuardGuard]},
  {path:"adminRestaurantView",component:AdminRestaurantViewComponent,canActivate:[AuthGuardGuard]},
  {path:"adminAddItem",component:AddItemsComponent},
  {path:"adminAddRestaurant",component:AddRestaurantComponent},
  {path:"adminFoodItem",component:FooditemComponent},
  {path:"contact",component:ContactComponent},
  {path:"**",component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
