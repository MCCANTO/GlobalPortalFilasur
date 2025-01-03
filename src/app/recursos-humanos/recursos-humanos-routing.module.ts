import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecursosHumanosComponent } from './recursos-humanos.component';
import { SolicitudAdelantoRemuneracionComponent } from './views/solicitud-adelanto-remuneracion/solicitud-adelanto-remuneracion.component';
import { SolicitudPrestamoComponent } from './views/solicitud-prestamo/solicitud-prestamo.component';
import { ListaSolicitudPrestamoComponent } from './views/lista-solicitud-prestamo/lista-solicitud-prestamo/lista-solicitud-prestamo.component';

import { ListaAdelantoRemuneracionJefaturaComponent } from './views/solicitud-adelanto-remuneracion/lista-adelanto-remuneracion-jefatura/lista-adelanto-remuneracion-jefatura.component';
import { ListaSolicitudAdelantoSueldoComponent } from './views/lista-solicitud-adelanto-sueldo/lista-solicitud-adelanto-sueldo.component';
import { ListaSolicitudAprobacionComponent } from './views/lista-solicitud-prestamo/lista-solicitud-aprobacion/lista-solicitud-aprobacion.component';
import { PrestamoExtraordinarioComponent } from './views/prestamo-extraordinario/prestamo-extraordinario.component';

const routes: Routes = [
  {
    path: '', component: RecursosHumanosComponent, children: [
      {
        path: 'solicitud-prestamo',
        component: SolicitudPrestamoComponent,
        data: { icon: 'table', text: 'Solicitud de Prestamo' }
      },
      {
        path: 'prestamo-extraordinario',
        component: PrestamoExtraordinarioComponent,
        data: { icon: 'list', text: 'Préstamo Extraordinario'}
      },
      {
        path: 'lista-solicitud-prestamo',
        component: ListaSolicitudPrestamoComponent,
        data: { icon: 'list', text: 'Lista Solicitudes' }
      },
      {
        path: 'lista-prestamo-aprobacion',
        component: ListaSolicitudAprobacionComponent,
        data: { icon: 'list', text: 'Prestamos pendientes' }
      },
      {
        path: 'solicitud-adelanto-remuneracion',
        component: SolicitudAdelantoRemuneracionComponent,
        data: { icon: 'table', text: 'Solicitud de Adelanto Sueldo' }
      },
      {
        path: 'lista-solicitud-adelanto',
        component: ListaSolicitudAdelantoSueldoComponent,
        data: { icon: 'list', text: 'Lista Adelanto' }
      },
      {
        path: 'lista-adelanto-aprobacion',
        component: ListaAdelantoRemuneracionJefaturaComponent,
        data: { icon: 'list', text: 'Lista Jefatura' }
      },
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecursosHumanosRoutingModule { }
