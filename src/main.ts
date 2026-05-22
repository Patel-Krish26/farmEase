import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';

// Components
import { Signup } from './app/pages/signup/signup';
import { Login } from './app/pages/login/login';
import { HomePage } from './app/pages/Home/home-page/home-page';
import { About } from './app/pages/about/about';
import { News } from './app/pages/news/news';
import { Products } from './app/pages/products/products';
import { Profile } from './app/pages/profile/profile';
import { Cart } from './app/pages/cart/cart';
import { OrdersComponent } from './app/pages/orders/orders';
import { WishlistComponent } from './app/pages/wishlist/wishlist';
import { DataComponent } from './app/pages/data-cs/data-cs';
import { Contact as CustomerSupport } from './app/pages/contact/contact';
import { AddProduct } from './app/pages/add-product/add-product';
import { Chat } from './app/pages/chat/chat';

// Guard & Interceptor
import { authGuard } from './app/core/guards/auth.guard';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { Admin } from './app/pages/admin/admin';


const routes: Routes = [
  { path: '', redirectTo: 'HomePage', pathMatch: 'full' },
  { path: 'HomePage', component: HomePage },
  { path: 'Signup', component: Signup },
  { path: 'Login', component: Login },
  { path: 'About', component: About },

  // --- SHARED SECURE ROUTES (All roles) ---
  {
    path: 'News',
    component: News,
    canActivate: [authGuard],
    data: { roles: ['admin', 'farmer', 'customer'] }
  },
  {
    path: 'Profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'CustomerSupport',
    component: CustomerSupport,
    canActivate: [authGuard],
    data: { roles: ['admin', 'farmer', 'customer'] }
  },
  {
    path: 'Chat',
    component: Chat,
    canActivate: [authGuard],
    data: { roles: ['admin', 'farmer', 'customer'] }
  },

  // --- CUSTOMER ROUTES ---
  {
    path: 'Products',
    component: Products,
    canActivate: [authGuard],
    data: { roles: ['farmer', 'customer', 'admin'] }
  },
  {
    path: 'Cart',
    component: Cart,
    canActivate: [authGuard],
    data: { roles: ['farmer', 'customer'] }
  },
  {
    path: 'Orders',
    component: OrdersComponent,
    canActivate: [authGuard],
    data: { roles: ['farmer', 'customer'] }
  },
  {
    path: 'WishlistComponent',
    component: WishlistComponent,
    canActivate: [authGuard],
    data: { roles: ['farmer', 'customer'] }
  },

  // --- FARMER ROUTES ---
  {
    path: 'AddProduct',
    component: AddProduct,
    canActivate: [authGuard],
    data: { roles: ['farmer', 'admin'] }
  },
 

  // --- ADMIN ROUTES ---
  {
    path: 'DataComponent',
    component: DataComponent,
    canActivate: [authGuard],
    data: { roles: ['farmer', 'admin'] }
  },
 
  {
    path: 'admin/Admin',
    component: Admin,
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));
