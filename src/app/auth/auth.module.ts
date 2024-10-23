import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { SolicitudAccesoComponent } from './views/solicitud-acceso/solicitud-acceso.component';
import { CambiarPassComponent } from './views/cambiar-pass/cambiar-pass.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from './views/login/login.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SolicitudAccesoComponent,
    CambiarPassComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
