import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-solicitud-prestamo-rechazo',
  templateUrl: './dialog-solicitud-prestamo-rechazo.component.html',
  styleUrls: ['./dialog-solicitud-prestamo-rechazo.component.css']
})
export class DialogSolicitudPrestamoRechazoComponent {
  loading:boolean = false
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogSolicitudPrestamoRechazoComponent>,
  private registrarPrestamo: RegistroPrestamoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}


  onConfirm(){
    this.loading = true
    this.updateState(false).subscribe(response =>{
      this.dialogRef.close(true);
      this.snackBar.open('Solicitud rechazada', '❌', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      },error =>{
        console.error('Error al rechazar la solicitud', error);
      }).add(() =>{
        this.loading = false
      });
  }
  onCancel(){
    this.dialogRef.close(false);
  }


  updateState(approved: boolean): Observable<any> {
    const data = {
      id_prestamo: this.data.id_prestamo,
      motivo_rechazo_bs: this.data.motivo_rechazo,
      estado: approved// O cualquier campo necesario
    };
    console.log("datos enviar",data)
    return this.registrarPrestamo.UpdateLoanRequestState(data);
  }
}
