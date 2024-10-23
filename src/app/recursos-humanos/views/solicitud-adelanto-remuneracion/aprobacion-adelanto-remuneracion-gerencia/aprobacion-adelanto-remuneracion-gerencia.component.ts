import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogAprobacionAdelantoGerenciaComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-adelanto-gerencia/dialog-aprobacion-adelanto-gerencia.component';
import { DialogSolicitudAdelantoGerenciaRechazoComponent } from 'src/app/recursos-humanos/components/dialog-solicitud-adelanto-gerencia-rechazo/dialog-solicitud-adelanto-gerencia-rechazo.component';
import { DialogSolicitudPrestamoRechazoGerenciaComponent } from 'src/app/recursos-humanos/components/dialog-solicitud-prestamo-rechazo-gerencia/dialog-solicitud-prestamo-rechazo-gerencia.component';
import { AdelantoSueldoServiceService } from 'src/app/recursos-humanos/services/adelanto-sueldo-service.service';

@Component({
  selector: 'app-aprobacion-adelanto-remuneracion-gerencia',
  templateUrl: './aprobacion-adelanto-remuneracion-gerencia.component.html',
  styleUrls: ['./aprobacion-adelanto-remuneracion-gerencia.component.css']
})
export class AprobacionAdelantoRemuneracionGerenciaComponent {
  motivo_rechazo_ger: string=''
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AprobacionAdelantoRemuneracionGerenciaComponent>,
  private adelantoService: AdelantoSueldoServiceService,
  public dialog: MatDialog){}

  onApprove(): void {
    const dialogRef1 = this.dialog.open(DialogAprobacionAdelantoGerenciaComponent,{
      data: {
        id_adelanto_sueldo: this.data.request.id_adelanto_sueldo,
        motivo_rechazo: this.motivo_rechazo_ger},
        
      enterAnimationDuration: '300ms',  // Duración de la animación al abrir
      exitAnimationDuration: '350ms' 
    });
  
    dialogRef1.afterClosed().subscribe(result =>{
      setTimeout(() => {
      this.dialogRef.close();
      },300);
    });
  }

  onDeny(): void {
    const dialogRef1 = this.dialog.open(DialogSolicitudAdelantoGerenciaRechazoComponent,{
      data: {id_adelanto_sueldo: this.data.request.id_adelanto_sueldo},
      enterAnimationDuration: '300ms',  // Duración de la animación al abrir
      exitAnimationDuration: '400ms'
    });

    dialogRef1.afterClosed().subscribe(result =>{
      setTimeout(() => {
        //this.dialogRef1.close();
      }, 300);
    });
  }

  isApprovalComplete(): boolean {
    return this.data.request.confirmacion_gerente_rh === false  && this.data.request.confirmacion_bs === true;
  }

  getEstado(confirmacion_bs: boolean): string {
    return confirmacion_bs ? 'APROBADO' : 'PENDIENTE';
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

}
