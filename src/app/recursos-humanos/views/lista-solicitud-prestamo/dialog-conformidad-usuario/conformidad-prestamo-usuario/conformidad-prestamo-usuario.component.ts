import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { DialogAprobacionEmpleadoComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-prestamo-empleado/dialog-aprobacion-empleado.component';
import { PrestamoArchivoService } from 'src/app/recursos-humanos/services/prestamo-archivo.service';
import { RegistroPrestamoServiceService } from 'src/app/recursos-humanos/services/registro-prestamo-service.service';

@Component({
  selector: 'app-conformidad-prestamo-usuario',
  templateUrl: './conformidad-prestamo-usuario.component.html',
  styleUrls: ['./conformidad-prestamo-usuario.component.css']
})
export class ConformidadPrestamoUsuarioComponent implements OnInit{

  ELEMENT_DATA!: any[];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  usercode!:string;
  displayedColumns: string[] = ['nro', 'nombre', 'accion'];
  documentDataSource = [];
  puesto_validar!: string;
  

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ConformidadPrestamoUsuarioComponent>,
  public dialog: MatDialog,
  private registrarPrestamo: RegistroPrestamoServiceService,
  private _prestamoArchivoService: PrestamoArchivoService,
  private _jwtTokenService: JwtTokenService
){
  this.usercode = this._jwtTokenService.getUserCode();
  

}


  ngOnInit(): void {
    this.applyDiscountToInstallments();
    this.cargarDocumentosSolicitudPrestamo();
    
  }


openBase64File(base64: string) {
  const mimeType = base64.substring(base64.indexOf(':') + 1, base64.indexOf(';'));
  const win = window.open();
  if (mimeType.startsWith('image')) {
    win?.document.write('<img src="' + base64 + '" alt="Image" style="width:100%; height:100%;">');
  } else if (mimeType === 'application/pdf') {
    win?.document.write('<iframe src="' + base64 + '" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>');
  } else {
    win?.document.write('<p>Unsupported file type</p>');
  }
}

viewDocument(event: MouseEvent, nombre:string, empleado:string) {
  event.preventDefault();
  this.registrarPrestamo.getFileUrl(empleado, this.data.request.id_prestamo, nombre).subscribe(response => {
    this.openBase64File(response);
    }
  )
}

cargarDocumentosSolicitudPrestamo() {
  this._prestamoArchivoService.getArchivosxPrestamo(this.data.request.empleado,this.data.request.id_prestamo).subscribe(response => {
    console.log(response)
    this.documentDataSource = response;
  })
}

isApprovalComplete(): boolean {
  return this.data.request.confirmacion_bs === true && this.data.request.confirmacion_gerente_rh === true 
        && this.data.request.confirmacion_trabajador === false;
}

onCancel(): void {
  this.dialogRef.close();

}

onApprove(): void {
  const dialogRef = this.dialog.open(DialogAprobacionEmpleadoComponent,{
    data: {id_prestamo: this.data.request.id_prestamo},
      enterAnimationDuration: '300ms',  // Duración de la animación al abrir
      exitAnimationDuration: '350ms'
  });
  
  dialogRef.afterClosed().subscribe(result =>{
    setTimeout(() => {
      this.dialogRef.close();
      },300);
  });
}

getMonthName(monthNumber: number): string {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[monthNumber - 1];
}


getEstadoJefatura(confirmacion_bs: boolean): string {
  return confirmacion_bs ? 'APROBADO' : 'PENDIENTE';
}

getEstadoGerencia(confirmacion_gerente_rh: boolean): string {
  return confirmacion_gerente_rh ? 'APROBADO' : 'PENDIENTE';
}

loadSolicitudesAdelantoSueldo() {
  this.registrarPrestamo.GetLoanApplicationCreated(this.usercode)
  .subscribe((response:any) => {
    this.dataSource.data = response as LoanRequest[];
  })
}

getDescuentoGratificacion(): {titulo: string, monto: number}[] {
  const descuentos = [];

  if (this.data.request.valor_descuento_julio > 0) {
    descuentos.push({ titulo: 'Descuento Gratificación Julio', monto: this.data.request.valor_descuento_julio });
  }

  if (this.data.request.valor_descuento_diciembre > 0) {
    descuentos.push({ titulo: 'Descuento Gratificación Diciembre', monto: this.data.request.valor_descuento_diciembre });
  }

  return descuentos;
}

tieneDescuentoGratificacion(): boolean {
  return this.data.request.valor_descuento_julio > 0 || this.data.request.valor_descuento_diciembre > 0;
}


getMontosDescuentoGratificacion(): { julio: number, diciembre: number } {
  return {
    julio: this.data.request.valor_descuento_julio > 0 ? this.data.request.valor_descuento_julio : 0,
    diciembre: this.data.request.valor_descuento_diciembre > 0 ? this.data.request.valor_descuento_diciembre : 0
  };
}

applyDiscountToInstallments() {
  const discountMonths = { julio: 7, diciembre: 12 }; // Meses de los descuentos: Julio (7), Diciembre (12)
  const discountAmounts = this.getMontosDescuentoGratificacion(); // Obtener los montos de los descuentos

  this.data.details = this.data.details.map((installment: Installment) => {
    const installmentMonth = this.getMonthName(installment.mes);

    // Sumar el descuento correspondiente al mes de julio
    if (installmentMonth === this.getMonthName(discountMonths.julio) && discountAmounts.julio > 0) {
      installment.valor_descuento += discountAmounts.julio;
    }

    // Sumar el descuento correspondiente al mes de diciembre
    if (installmentMonth === this.getMonthName(discountMonths.diciembre) && discountAmounts.diciembre > 0) {
      installment.valor_descuento += discountAmounts.diciembre;
    }

    return installment;
  });
}


  // Obtiene el mes en que aplica el descuento (julio o diciembre)
  getDiscountMonth(): number | null {
    const descuentoJulio = this.data.request.valor_descuento_julio;
    const descuentoDiciembre = this.data.request.valor_descuento_diciembre;

    if (descuentoJulio) {
      return 7; // Julio
    } else if (descuentoDiciembre) {
      return 12; // Diciembre
    }
    return null; // No hay descuento en julio o diciembre
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

}

interface LoanRequest {
  id_prestamo: number;
  nombre_completo: string;
  area: string;
  puesto: string;
  monto: number;
  motivo: string;
  confirmacion_trabajador?: boolean;
  confirmacion_bs?: boolean;
  confirmacion_gerente_rh?: boolean;
}

interface Installment {
  mes: number;
  valor_descuento: number;
  // Otros campos que tengas en los detalles
}