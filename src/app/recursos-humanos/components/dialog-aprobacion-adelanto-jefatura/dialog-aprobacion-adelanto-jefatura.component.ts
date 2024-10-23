import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';

@Component({
  selector: 'app-dialog-aprobacion-adelanto-jefatura',
  templateUrl: './dialog-aprobacion-adelanto-jefatura.component.html',
  styleUrls: ['./dialog-aprobacion-adelanto-jefatura.component.css']
})
export class DialogAprobacionAdelantoJefaturaComponent {

  loading: boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogAprobacionAdelantoJefaturaComponent>,
  private adelantoSueldo: AdelantoSueldoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}


  onConfirm() {
    // Activar el spinner
    this.loading = true;
  
    this.updateState(true).subscribe(
      response => {
        // Cerrar el diálogo y mostrar el snackbar si la solicitud es exitosa
        this.dialogRef.close(true);
        this.snackBar.open('Solicitud aprobada', '✔️', {
          duration: 3000, 
          panelClass: ['snackbar-success']
        });
      }
    ).add(() => {
      // Desactivar el spinner al final del proceso (éxito o error)
      this.loading = false;
    });
  }

  onCancel(){
    this.dialogRef.close(false);
  }


  updateState(approved: boolean): Observable<any> {
    const data = {
      id_adelanto_sueldo: this.data.id_adelanto_sueldo,
      confirmacion_bs: approved// O cualquier campo necesario
    };
    return this.adelantoSueldo.UpdateSupervisorState(data);
  }


  
}
