
import { ListaSolicitudAdelantoSueldoComponent } from "./recursos-humanos/views/lista-solicitud-adelanto-sueldo/lista-solicitud-adelanto-sueldo.component";
import { ListaSolicitudAprobacionComponent } from "./recursos-humanos/views/lista-solicitud-prestamo/lista-solicitud-aprobacion/lista-solicitud-aprobacion.component";
import { ListaSolicitudPrestamoComponent } from "./recursos-humanos/views/lista-solicitud-prestamo/lista-solicitud-prestamo/lista-solicitud-prestamo.component";
import { PrestamoExtraordinarioComponent } from "./recursos-humanos/views/prestamo-extraordinario/prestamo-extraordinario.component";
import { SolicitudAdelantoRemuneracionComponent } from "./recursos-humanos/views/solicitud-adelanto-remuneracion/solicitud-adelanto-remuneracion.component";
import { SolicitudPrestamoComponent } from "./recursos-humanos/views/solicitud-prestamo/solicitud-prestamo.component";
import { DashboardComponent } from "./shared/dashboard/dashboard.component";

export const childRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { icon: 'dashboard', text: 'Dashboard' }
  },
  {
    path: 'recursos-humanos',
    data: { icon: 'folder', text: 'RH', roles: ['admin', 'rh-user', 'rh-bs', 'rh-gerencia'] },
    children: [
      {
        path: 'solicitud-prestamo',
        component: SolicitudPrestamoComponent,
        data: { icon: 'bar_chart', text: 'Solicitar préstamo', roles: ['admin', 'rh-user', 'rh-bs', 'rh-gerencia'] }
      },
      { path: 'lista-solicitud-prestamo',
        component: ListaSolicitudPrestamoComponent,
        data: { icon: 'list', text: 'Mis Prestamos', roles: ['admin', 'rh-user', 'rh-bs', 'rh-gerencia'] }
      },      
      { path: 'lista-prestamo-aprobacion',
         component: ListaSolicitudAprobacionComponent,
         data: { icon: 'list', text: 'Aprobacion Prestamos', roles: ['admin', 'rh-bs', 'rh-gerencia'] }
      },
      {
        path: 'prestamo-extraordinario',
        component: PrestamoExtraordinarioComponent,
        data: { icon:'list', text: 'Préstamo Extraordinario', roles: ['admin','rh-user','rh-bs','rh-gerencia']}
      },
      { path: 'solicitud-adelanto-remuneracion',
        component: SolicitudAdelantoRemuneracionComponent,
        data: { icon: 'bar_chart', text: 'Adelanto', roles: ['admin', 'rh-user', 'rh-bs', 'rh-gerencia'] }
      },
      { path: 'lista-solicitud-adelanto',
        component: ListaSolicitudAdelantoSueldoComponent,
        data: { icon: 'list', text: 'Mis adelantos', roles: ['admin', 'rh-user', 'rh-bs', 'rh-gerencia'] }
      },
      { path: 'lista-adelanto-aprobacion',
        component: ListaSolicitudAdelantoSueldoComponent,
        data: { icon: 'list', text: 'Aprobacion adelanto', roles: ['admin', 'rh-bs', 'rh-gerencia'] }
      },
    ]
  }
];
