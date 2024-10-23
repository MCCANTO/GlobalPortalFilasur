import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';

@Component({
  selector: 'app-dialog-aprobacion-adelanto-gerencia',
  templateUrl: './dialog-aprobacion-adelanto-gerencia.component.html',
  styleUrls: ['./dialog-aprobacion-adelanto-gerencia.component.css']
})
export class DialogAprobacionAdelantoGerenciaComponent {

  loading: boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogAprobacionAdelantoGerenciaComponent>,
  private adelantoSueldo: AdelantoSueldoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar){}


  onConfirm(){
this.loading= true;

    this.updateState(true).subscribe(
      response =>{      
        this.dialogRef.close();
      this.snackBar.open('Solicitud aprobada', '✔️', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      
      },error =>{
        console.error('Error al aprobar la solicitud', error);
      }).add(() =>{
        this.loading = false;
      });
      
  }
  onCancel(){
    this.dialogRef.close(true);
  }


  updateState(approved: boolean): Observable<any> {
    const data = {
      id_adelanto_sueldo: this.data.id_adelanto_sueldo,
      motivo_rechazo_ger: this.data.motivo_rechazo,
      confirmacion_gerente_rh: approved
    };
    return this.adelantoSueldo.UpdateManagerApprobalState(data);
  }



}
