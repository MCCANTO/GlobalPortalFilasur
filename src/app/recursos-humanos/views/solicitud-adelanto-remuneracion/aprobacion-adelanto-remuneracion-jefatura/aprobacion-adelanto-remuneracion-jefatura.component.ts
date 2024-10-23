import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogAprobacionAdelantoJefaturaComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-adelanto-jefatura/dialog-aprobacion-adelanto-jefatura.component';
import { DialogSolicitudAdelantoBsRechazoComponent } from 'src/app/recursos-humanos/components/dialog-solicitud-adelanto-bs-rechazo/dialog-solicitud-adelanto-bs-rechazo.component';
import { RegistroPrestamoServiceService } from 'src/app/recursos-humanos/services/registro-prestamo-service.service';

@Component({
  selector: 'app-aprobacion-adelanto-remuneracion-jefatura',
  templateUrl: './aprobacion-adelanto-remuneracion-jefatura.component.html',
  styleUrls: ['./aprobacion-adelanto-remuneracion-jefatura.component.css']
})
export class AprobacionAdelantoRemuneracionJefaturaComponent {
  motivo_rechazo_bs: string=''
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AprobacionAdelantoRemuneracionJefaturaComponent>,
  private registrarPrestamo: RegistroPrestamoServiceService,
  public dialog: MatDialog){}

  onApprove(): void {
    const dialogRef = this.dialog.open(DialogAprobacionAdelantoJefaturaComponent,{
      data: {id_adelanto_sueldo: this.data.request.id_adelanto_sueldo},
      enterAnimationDuration: '300ms',  // Duración de la animación al abrir
      exitAnimationDuration: '350ms'
    });

    dialogRef.afterClosed().subscribe(result =>{
      setTimeout(() => {
        this.dialogRef.close();
        },300);
    });
  }

  onDeny(): void {
    const dialogRef = this.dialog.open(DialogSolicitudAdelantoBsRechazoComponent,{
      data: {
        id_adelanto_sueldo: this.data.request.id_adelanto_sueldo,
        motivo_rechazo: this.motivo_rechazo_bs
      },
      enterAnimationDuration: '300ms',  // Duración de la animación al abrir
      exitAnimationDuration: '350ms'
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.dialogRef.close();
      }
    });
  }

  updateState(approved: boolean): Observable<any> {
    const data = {
      id_prestamo: this.data.request.id_prestamo,
      confirmacion_bs: approved// O cualquier campo necesario
    };
    return this.registrarPrestamo.UpdateSupervisorState(data);
  }

  getEstado(confirmacion_bs: boolean): string {
    return confirmacion_bs ? 'APROBADO' : 'PENDIENTE';
  }


  isApprovalComplete(): boolean {
    return this.data.request.confirmacion_bs === false;
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

}
