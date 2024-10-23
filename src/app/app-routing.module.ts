import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule) },
  { path: '', redirectTo: '/auth-login', pathMatch: 'full' },
  { path: 'auth-login', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule) },
  { path: 'dashboard', canActivate: [AuthGuard],  component: DashboardComponent },
  // { path: 'planeamiento-financiero', canActivate: [AuthGuard], loadChildren: () => import('./planeamiento-financiero/planeamiento-financiero.module').then(m => m.PlaneamientoFinancieroModule) },
  { path: 'recursos-humanos', canActivate: [AuthGuard], loadChildren: () => import('./recursos-humanos/recursos-humanos.module').then(m => m.RecursosHumanosModule) },
  // { path: 'comercial', loadChildren: () => import('./comercial/comercial.module').then(m => m.ComercialModule) },
  // { path: 'investigacion-desarrollo', loadChildren: () => import('./investigacion-desarrollo/investigacion-desarrollo.module').then(m => m.InvestigacionDesarrolloModule) },
  { path: '404', component: NotFoundComponent },
  { path: 'gestion-usuario', loadChildren: () => import('./gestion-usuario/gestion-usuario.module').then(m => m.GestionUsuarioModule) },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
