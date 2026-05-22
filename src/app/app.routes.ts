import { Routes } from '@angular/router';

// Page Imports
import { HomePage } from './pages/Home/home-page/home-page';
import { About } from './pages/about/about';
import { Products } from './pages/products/products';
import { Cart } from './pages/cart/cart';
import { WishlistComponent } from './pages/wishlist/wishlist';
import { Profile } from './pages/profile/profile';
import { OrdersComponent } from './pages/orders/orders';
import { Admin } from './pages/admin/admin';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: 'HomePage', pathMatch: 'full' },
  { path: 'HomePage', component: HomePage },
  { path: 'About', component: About },
  { path: 'Products', component: Products },
  { path: 'Cart', component: Cart },
  { path: 'Wishlist', component: WishlistComponent },
  { path: 'Profile', component: Profile },
  { path: 'Orders', component: OrdersComponent },
  { path: 'Contact', component: Contact },
  { path: 'Admin', component: Admin },
  { path: 'Login', component: Login },
  { path: 'Signup', component: Signup },
  { path: '**', redirectTo: 'HomePage' }
];
