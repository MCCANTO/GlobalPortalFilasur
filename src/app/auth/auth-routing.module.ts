import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './views/login/login.component';
import { SolicitudAccesoComponent } from './views/solicitud-acceso/solicitud-acceso.component';
import { CambiarPassComponent } from './views/cambiar-pass/cambiar-pass.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'solicitar-acceso', component: SolicitudAccesoComponent },
  { path: 'cambiar-pass', component: CambiarPassComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
