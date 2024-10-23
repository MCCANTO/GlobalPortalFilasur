import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { DialogAprobacionAdelantoEmpleadoComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-adelanto-empleado/dialog-aprobacion-adelanto-empleado.component';
import { AdelantoSueldoServiceService } from 'src/app/recursos-humanos/services/adelanto-sueldo-service.service';

@Component({
  selector: 'app-dialog-conformidad-usuario',
  templateUrl: './dialog-conformidad-usuario.component.html',
  styleUrls: ['./dialog-conformidad-usuario.component.css']
})
export class DialogConformidadUsuarioComponent {
  ELEMENT_DATA!: any[];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  usercode!:string;

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogConformidadUsuarioComponent>,
  public dialog: MatDialog,
  private adelantoservice: AdelantoSueldoServiceService,
  private _jwtTokenService: JwtTokenService
){
  this.usercode = this._jwtTokenService.getUserCode();
}

isApprovalComplete(): boolean {
  return this.data.request.confirmacion_bs === true && this.data.request.confirmacion_gerente_rh === true
         && this.data.request.confirmacion_trabajador === false;
}

onCancel(): void {
  this.dialogRef.close();
}

onApprove(): void {
  const dialogRef = this.dialog.open(DialogAprobacionAdelantoEmpleadoComponent,{
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



getEstadoJefatura(confirmacion_bs: boolean): string {
  return confirmacion_bs ? 'APROBADO' : 'PENDIENTE';
}

getEstadoGerencia(confirmacion_gerente_rh: boolean): string {
  return confirmacion_gerente_rh ? 'APROBADO' : 'PENDIENTE';
}

loadSolicitudesAdelantoSueldo() {
  this.adelantoservice.GetAllAdvancedSalaryRequest(this.usercode)
  .subscribe((response:any) => {
    this.dataSource.data = response as [];
  })
}

formatDate(date: string): string {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}

}
