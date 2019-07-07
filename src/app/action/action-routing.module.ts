import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditemComponent} from './additem/additem.component';
import { OrderComponent} from './order/order.component';


const routes: Routes = [
  { path: 'additem', component: AdditemComponent },
  { path: 'orders', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
