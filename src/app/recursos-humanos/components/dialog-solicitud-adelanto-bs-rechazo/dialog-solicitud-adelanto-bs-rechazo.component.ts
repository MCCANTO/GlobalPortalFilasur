import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-solicitud-adelanto-bs-rechazo',
  templateUrl: './dialog-solicitud-adelanto-bs-rechazo.component.html',
  styleUrls: ['./dialog-solicitud-adelanto-bs-rechazo.component.css']
})
export class DialogSolicitudAdelantoBsRechazoComponent {

  loading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogSolicitudAdelantoBsRechazoComponent>,
  private adelantoSueldo: AdelantoSueldoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}


  onConfirm(){
    this.loading = true;

    this.updateState(false).subscribe(
      response =>{
      this.dialogRef.close(true);
      this.snackBar.open('Solicitud rechazada', '❌', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      },error =>{
        console.error('Error al rechazar la solicitud', error);
      }).add(() =>{
        this.loading = false;
      });
  }
  onCancel(){
    this.dialogRef.close(false);
  }


  updateState(approved: boolean): Observable<any> {
    const data = {
      id_adelanto_sueldo: this.data.id_adelanto_sueldo,
      motivo_rechazo_bs: this.data.motivo_rechazo,
      estado: approved// O cualquier campo necesario
    };
    return this.adelantoSueldo.UpdateAdvancedRequestState(data);
  }

}
