import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-approbal-confirm',
  templateUrl: './dialog-approbal-confirm.component.html',
  styleUrls: ['./dialog-approbal-confirm.component.css']
})
export class DialogApprobalConfirmComponent {
  loading:boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogApprobalConfirmComponent>,
  private registrarPrestamo: RegistroPrestamoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}

  onCancel(){
    this.dialogRef.close(false);
  }

  onConfirm(){
    this.loading = true;
    this.updateState(true).subscribe(response =>{
      this.dialogRef.close(true);
      this.snackBar.open('Solicitud aprobada', '✔️', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      },error =>{
        console.error('Error al aprobar la solicitud', error);
      }).add(()=>{
        this.loading = false;
      });
  }



  updateState(approved: boolean): Observable<any> {
    const data = {
      id_prestamo: this.data.id_prestamo,
      confirmacion_gerente_rh: approved// O cualquier campo necesario
    };
    return this.registrarPrestamo.UpdateManagerApprobalState(data);
  }
}
