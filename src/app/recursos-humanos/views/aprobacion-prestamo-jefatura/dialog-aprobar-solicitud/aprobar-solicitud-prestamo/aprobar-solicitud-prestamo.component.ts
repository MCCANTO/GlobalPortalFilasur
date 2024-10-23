import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { DialogAprobacionJefaturaComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-jefatura/dialog-aprobacion-jefatura.component';
import { DialogSolicitudPrestamoRechazoComponent } from 'src/app/recursos-humanos/components/dialog-solicitud-prestamo-rechazo/dialog-solicitud-prestamo-rechazo.component';
import { PrestamoArchivoService } from 'src/app/recursos-humanos/services/prestamo-archivo.service';
import { RegistroPrestamoServiceService } from 'src/app/recursos-humanos/services/registro-prestamo-service.service';

@Component({
  selector: 'app-aprobar-solicitud-prestamo',
  templateUrl: './aprobar-solicitud-prestamo.component.html',
  styleUrls: ['./aprobar-solicitud-prestamo.component.css']
})
export class AprobarSolicitudPrestamoComponent implements OnInit{

  usercode:string;
  motivo_rechazo_bs:string = '';
  displayedColumns: string[] = ['nro', 'nombre', 'accion'];
  documentDataSource = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AprobarSolicitudPrestamoComponent>,
    private _registrarPrestamoService: RegistroPrestamoServiceService,
    private _prestamoArchivoService: PrestamoArchivoService,
    public dialog: MatDialog,
    public _jwt: JwtTokenService
  ){
    this.usercode = _jwt.getUserCode();
  }

  ngOnInit(): void {
    this.cargarDocumentosSolicitudPrestamo();
    this.applyDiscountToInstallments();
  }

  cargarDocumentosSolicitudPrestamo() {
    this._prestamoArchivoService.getArchivosxPrestamo(this.data.request.empleado,this.data.request.id_prestamo).subscribe(response => {
      this.documentDataSource = response;
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  onApprove(): void {
    const dialogRef = this.dialog.open(DialogAprobacionJefaturaComponent,{
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

  onDeny(): void {
    const dialogRef = this.dialog.open(DialogSolicitudPrestamoRechazoComponent,{
      data: {id_prestamo: this.data.request.id_prestamo,
        motivo_rechazo: this.motivo_rechazo_bs}
      
    });
    dialogRef.afterClosed().subscribe(result =>{
        this.dialogRef.close();
    });
  }

  isApprovalComplete(): boolean {
    return this.data.request.confirmacion_bs === false;
  }

  updateState(approved: boolean): Observable<any> {
    const data = {
      id_prestamo: this.data.request.id_prestamo,
      confirmacion_bs: approved// O cualquier campo necesario
    };
    console.log('Datos enviados al backend:', data); 
    return this._registrarPrestamoService.UpdateSupervisorState(data);
  }

  getEstado(confirmacion_bs: boolean): string {
    return confirmacion_bs ? 'APROBADO' : 'PENDIENTE';
  }


  tieneDescuentoGratificacion(): boolean {
    return this.data.request.valor_descuento_julio > 0 || this.data.request.valor_descuento_diciembre > 0;
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

  getMontosDescuentoGratificacion(): { julio: number, diciembre: number } {
    return {
      julio: this.data.request.valor_descuento_julio > 0 ? this.data.request.valor_descuento_julio : 0,
      diciembre: this.data.request.valor_descuento_diciembre > 0 ? this.data.request.valor_descuento_diciembre : 0
    };
  }

  getTituloDescuentoGratificacion(): string {
    if (this.data.request.valor_descuento_julio > 0) {
      return 'Descuento Gratificación Julio';
    } else if (this.data.request.valor_descuento_diciembre > 0) {
      return 'Descuento Gratificación Diciembre';
    } else {
      return 'Descuento Gratificación';
    }
  }

  getMonthName(monthNumber: number): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[monthNumber - 1];
  }


  viewDocument(event: MouseEvent, nombre:string, empleado:string) {
    event.preventDefault();
    this._registrarPrestamoService.getFileUrl(empleado, this.data.request.id_prestamo, nombre).subscribe(response => {
      this.openBase64File(response);
      }
    )
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

  /* CONFIGURACION DE SUMATORIA DE DSCTO GRATIFICACION JULIO/DICIEMBRE PARA ASIGNACION DE CUOTAS */

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

interface Installment {
  mes: number;
  valor_descuento: number;
  // Otros campos que tengas en los detalles
}