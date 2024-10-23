import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-aprobacion-adelanto-empleado',
  templateUrl: './dialog-aprobacion-adelanto-empleado.component.html',
  styleUrls: ['./dialog-aprobacion-adelanto-empleado.component.css']
})
export class DialogAprobacionAdelantoEmpleadoComponent {

  usercode!:string;
  loading:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogAprobacionAdelantoEmpleadoComponent>,
  private adelantoService: AdelantoSueldoServiceService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private _jwtTokenService:JwtTokenService,
){
  this.usercode = this._jwtTokenService.getUserCode();
}


  onConfirm(){
    this.loading = true;
    this.updateState(true).subscribe(response =>{
      this.dialogRef.close(true);
      this.snackBar.open('Confirmacion brindada', '✔️', {
        duration: 3000, // Duración en milisegundos
        panelClass: ['snackbar-success']
      });
      },error =>{
        console.error('Error al aprobar la solicitud de adelanto', error);
      }).add(()=>{
        this.loading = false;
      });
      this.UpdateListRequest();
  }
  onCancel(){
    this.dialogRef.close(false);
  }


  updateState(approved: boolean): Observable<any> {
    const data = {
      id_adelanto_sueldo: this.data.id_adelanto_sueldo,
      confirmacion_trabajador: approved// O cualquier campo necesario
    };
    return this.adelantoService.UpdateEmployeeApprobalState(data);
  }

  UpdateListRequest(): Observable<any>{
    /*const data = {
      data: this.data.Datasource
    };
    console.log('lista actualizada',data);*/
    return this.adelantoService.GetAllAdvancedSalaryRequest(this.usercode);
  }

}
