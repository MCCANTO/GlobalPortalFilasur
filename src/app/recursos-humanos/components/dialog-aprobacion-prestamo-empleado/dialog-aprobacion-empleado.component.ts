import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';

@Component({
  selector: 'app-dialog-aprobacion-empleado',
  templateUrl: './dialog-aprobacion-empleado.component.html',
  styleUrls: ['./dialog-aprobacion-empleado.component.css']
})
export class DialogAprobacionEmpleadoComponent {

  usercode!:string;
  loading:boolean= false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogAprobacionEmpleadoComponent>,
  private registrarPrestamo: RegistroPrestamoServiceService,
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
        console.error('Error al aprobar la solicitud', error);
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
      id_prestamo: this.data.id_prestamo,
      confirmacion_trabajador: approved// O cualquier campo necesario
    };
    return this.registrarPrestamo.UpdateEmployeeState(data);
  }

  UpdateListRequest(): Observable<any>{
    /*const data = {
      data: this.data.Datasource
    };
    console.log('lista actualizada',data);*/
    return this.registrarPrestamo.GetLoanApplicationCreated(this.usercode);
  }
}
