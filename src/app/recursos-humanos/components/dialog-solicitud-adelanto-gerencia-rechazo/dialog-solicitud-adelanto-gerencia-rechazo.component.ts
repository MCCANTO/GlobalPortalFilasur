import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-solicitud-adelanto-gerencia-rechazo',
  templateUrl: './dialog-solicitud-adelanto-gerencia-rechazo.component.html',
  styleUrls: ['./dialog-solicitud-adelanto-gerencia-rechazo.component.css']
})
export class DialogSolicitudAdelantoGerenciaRechazoComponent {
loading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogSolicitudAdelantoGerenciaRechazoComponent>,
  private adelantoSueldo: AdelantoSueldoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}

  onCancel(){
    this.dialogRef.close(false);
  }

  onConfirm(){
    this.loading = true;
    this.updateState(false).subscribe(response =>{
      this.dialogRef.close(true);
      this.snackBar.open('Solicitud rechazada', '❌', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      },error =>{
        console.error('Error al rechazar la solicitud', error);
      }).add( () =>{
        this.loading = false;
      });
  }



  updateState(approved: boolean): Observable<any> {
    const data = {
      id_adelanto_sueldo: this.data.id_adelanto_sueldo,
      confirmacion_bs: approved// O cualquier campo necesario
    };
    return this.adelantoSueldo.UpdateAdvancedRequestStateManager(data);
  }
}
