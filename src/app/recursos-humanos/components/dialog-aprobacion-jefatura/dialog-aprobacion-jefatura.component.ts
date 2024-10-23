import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { BaseService } from '../../services/base.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-aprobacion-jefatura',
  templateUrl: './dialog-aprobacion-jefatura.component.html',
  styleUrls: ['./dialog-aprobacion-jefatura.component.css']
})
export class DialogAprobacionJefaturaComponent {

  isloadingAprobacion: boolean=false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogAprobacionJefaturaComponent>,
  private registrarPrestamo: RegistroPrestamoServiceService,
  private baseService: BaseService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}


  onConfirm(){
    this.isloadingAprobacion = true;
    this.updateState(true).subscribe(response =>{
      this.dialogRef.close(true);
      this.snackBar.open('Solicitud aprobada', '✔️', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      },error =>{
        
      }).add(()=>{
        this.isloadingAprobacion = false;
      });
  }
  onCancel(){
    this.dialogRef.close(false);
  }


  updateState(approved: boolean): Observable<any> {
    const data = {
      id_prestamo: this.data.id_prestamo,
      confirmacion_bs: approved// O cualquier campo necesario
    };
    return this.registrarPrestamo.UpdateSupervisorState(data);
  }

}
