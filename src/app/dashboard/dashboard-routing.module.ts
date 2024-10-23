import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
  import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [{ path: '', component: DashboardComponent }],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
