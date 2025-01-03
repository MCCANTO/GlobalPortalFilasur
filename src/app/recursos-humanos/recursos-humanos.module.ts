import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursosHumanosRoutingModule } from './recursos-humanos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SolicitudPrestamoComponent } from './views/solicitud-prestamo/solicitud-prestamo.component';
import { SolicitudAdelantoRemuneracionComponent } from './views/solicitud-adelanto-remuneracion/solicitud-adelanto-remuneracion.component';
import { RecursosHumanosComponent } from './recursos-humanos.component';
import { ListaSolicitudPrestamoComponent } from './views/lista-solicitud-prestamo/lista-solicitud-prestamo/lista-solicitud-prestamo.component';
import { ConformidadPrestamoUsuarioComponent } from './views/lista-solicitud-prestamo/dialog-conformidad-usuario/conformidad-prestamo-usuario/conformidad-prestamo-usuario.component';
import { AprobarSolicitudPrestamoComponent } from './views/aprobacion-prestamo-jefatura/dialog-aprobar-solicitud/aprobar-solicitud-prestamo/aprobar-solicitud-prestamo.component';
import { DialogAprobarPrestamoGerenciaComponent } from './views/lista-solicitud-prestamo/dialog-aprobar-prestamo-gerencia/dialog-aprobar-prestamo-gerencia.component';
import { DialogApprobalConfirmComponent } from './components/dialog-approbal-confirm/dialog-approbal-confirm.component';
import { DialogAprobacionJefaturaComponent } from './components/dialog-aprobacion-jefatura/dialog-aprobacion-jefatura.component';
import { ListaAdelantoRemuneracionJefaturaComponent } from './views/solicitud-adelanto-remuneracion/lista-adelanto-remuneracion-jefatura/lista-adelanto-remuneracion-jefatura.component';
import { AprobacionAdelantoRemuneracionJefaturaComponent } from './views/solicitud-adelanto-remuneracion/aprobacion-adelanto-remuneracion-jefatura/aprobacion-adelanto-remuneracion-jefatura.component';
import { DialogAprobacionAdelantoJefaturaComponent } from './components/dialog-aprobacion-adelanto-jefatura/dialog-aprobacion-adelanto-jefatura.component';
import { DialogAprobacionAdelantoGerenciaComponent } from './components/dialog-aprobacion-adelanto-gerencia/dialog-aprobacion-adelanto-gerencia.component';
import { AprobacionAdelantoRemuneracionGerenciaComponent } from './views/solicitud-adelanto-remuneracion/aprobacion-adelanto-remuneracion-gerencia/aprobacion-adelanto-remuneracion-gerencia.component';
import { DialogAprobacionEmpleadoComponent } from './components/dialog-aprobacion-prestamo-empleado/dialog-aprobacion-empleado.component';
import { DialogSolicitudPrestamoEstadoComponent } from './views/lista-solicitud-prestamo/dialog-solicitud-prestamo-estado/dialog-solicitud-prestamo-estado.component';
import { DialogApprobalConfirmUserComponent } from './components/dialog-approbal-confirm-user/dialog-approbal-confirm-user.component';
import { DialogApprobalAdvancedConfirmUserComponent } from './components/dialog-approbal-advanced-confirm-user/dialog-approbal-advanced-confirm-user.component';
import { DialogSolicitudPrestamoSustentoComponent } from './components/dialog-solicitud-prestamo-sustento/dialog-solicitud-prestamo-sustento.component';
import { ListaSolicitudAdelantoSueldoComponent } from './views/lista-solicitud-adelanto-sueldo/lista-solicitud-adelanto-sueldo.component';
import { ListaSolicitudAprobacionComponent } from './views/lista-solicitud-prestamo/lista-solicitud-aprobacion/lista-solicitud-aprobacion.component';
import { DialogConformidadUsuarioComponent } from './views/solicitud-adelanto-remuneracion/dialog-conformidad-usuario/dialog-conformidad-usuario.component';
import { DialogAprobacionAdelantoEmpleadoComponent } from './components/dialog-aprobacion-adelanto-empleado/dialog-aprobacion-adelanto-empleado.component';
import { DialogSolicitudAdelantoEstadoComponent } from './views/solicitud-adelanto-remuneracion/dialog-solicitud-adelanto-estado/dialog-solicitud-adelanto-estado.component';
import { DialogPolicyComponent } from './components/dialog-policy/dialog-policy.component';
import { DialogSolicitudPrestamoRechazoComponent } from './components/dialog-solicitud-prestamo-rechazo/dialog-solicitud-prestamo-rechazo.component';
import { DialogSolicitudPrestamoRechazoGerenciaComponent } from './components/dialog-solicitud-prestamo-rechazo-gerencia/dialog-solicitud-prestamo-rechazo-gerencia.component';
import { DialogSolicitudAdelantoBsRechazoComponent } from './components/dialog-solicitud-adelanto-bs-rechazo/dialog-solicitud-adelanto-bs-rechazo.component';
import { DialogSolicitudAdelantoGerenciaRechazoComponent } from './components/dialog-solicitud-adelanto-gerencia-rechazo/dialog-solicitud-adelanto-gerencia-rechazo.component';
import { AlertBoxComponent } from './components/alert-box/alert-box.component';
import { PrestamoExtraordinarioComponent } from './views/prestamo-extraordinario/prestamo-extraordinario.component';


@NgModule({
  declarations: [
    RecursosHumanosComponent,
    SolicitudPrestamoComponent,
    SolicitudAdelantoRemuneracionComponent,
    ListaSolicitudPrestamoComponent,
    ConformidadPrestamoUsuarioComponent,
    AprobarSolicitudPrestamoComponent,
    DialogAprobarPrestamoGerenciaComponent,
    DialogApprobalConfirmComponent,
    DialogAprobacionJefaturaComponent,
    ListaAdelantoRemuneracionJefaturaComponent,
    AprobacionAdelantoRemuneracionJefaturaComponent,
    DialogAprobacionAdelantoJefaturaComponent,
    DialogAprobacionAdelantoGerenciaComponent,
    AprobacionAdelantoRemuneracionGerenciaComponent,
    DialogAprobacionEmpleadoComponent,
    DialogSolicitudPrestamoEstadoComponent,
    DialogApprobalConfirmUserComponent,
    DialogApprobalAdvancedConfirmUserComponent,
    DialogSolicitudPrestamoSustentoComponent,
    ListaSolicitudAdelantoSueldoComponent,
    ListaSolicitudAprobacionComponent,
    DialogConformidadUsuarioComponent,
    DialogAprobacionAdelantoEmpleadoComponent,
    DialogSolicitudAdelantoEstadoComponent,
    DialogPolicyComponent,
    DialogSolicitudPrestamoRechazoComponent,
    DialogSolicitudPrestamoRechazoGerenciaComponent,
    DialogSolicitudAdelantoBsRechazoComponent,
    DialogSolicitudAdelantoGerenciaRechazoComponent,
    AlertBoxComponent,
    PrestamoExtraordinarioComponent
  ],
  imports: [
    CommonModule,
    RecursosHumanosRoutingModule,
    SharedModule,
  ]
})
export class RecursosHumanosModule { }
