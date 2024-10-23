import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionUsuarioComponent } from './gestion-usuario.component';
import { ChangePassComponent } from './views/change-pass/change-pass.component';

const routes: Routes = [
  { path: '', component: GestionUsuarioComponent },
  { path: 'change-password', component: ChangePassComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionUsuarioRoutingModule { }
