import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderPageComponent } from './pages/order.page/order.page.component';
import { LoginPageComponent } from './pages/login.page/login.page.component';
import { authGuard } from './guards/auth.guard';
import { ForbiddenPage } from './pages/forbidden.page/forbidden.page';

const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginPageComponent, 
    canActivate: [authGuard], 
    data: { requireNoAuth: true } 
  },
  { 
    path: 'orders', 
    component: OrderPageComponent, 
    canActivate: [authGuard], 
    data: { role: 'tms-customer' } 
  },
  { path: 'forbidden', component: ForbiddenPage },
  { path: '**', redirectTo: '/orders' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 