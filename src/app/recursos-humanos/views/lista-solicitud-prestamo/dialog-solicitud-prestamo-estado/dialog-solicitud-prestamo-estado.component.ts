import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-solicitud-prestamo-estado',
  templateUrl: './dialog-solicitud-prestamo-estado.component.html',
  styleUrls: ['./dialog-solicitud-prestamo-estado.component.css']
})
export class DialogSolicitudPrestamoEstadoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  getIconClass(status: string): string {
    switch (status) {
      case 'Pendiente':
        return 'icon-pending';
      case 'En proceso':
        return 'icon-in-process';
      case 'Rechazado':
        return 'icon-rejected';
      default:
        return '';
    }
  }

  getIconName(status: string): string {
    switch (status) {
      case 'Pendiente':
        return 'hourglass_empty';
      case 'En proceso':
        return 'autorenew';
      case 'Rechazado':
        return 'cancel';
      default:
        return '';
    }
  }

}

const estadoList = [
  { status: 'Pendiente', date: new Date(2024, 0, 29, 0, 0), detail: 'Se registró la solicitud' },
];