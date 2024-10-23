import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionUsuarioRoutingModule } from './gestion-usuario-routing.module';
import { GestionUsuarioComponent } from './gestion-usuario.component';
import { ChangePassComponent } from './views/change-pass/change-pass.component';
import { ProfileComponent } from './views/profile/profile.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GestionUsuarioComponent,
    ChangePassComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    GestionUsuarioRoutingModule,
    SharedModule
  ]
})
export class GestionUsuarioModule { }
