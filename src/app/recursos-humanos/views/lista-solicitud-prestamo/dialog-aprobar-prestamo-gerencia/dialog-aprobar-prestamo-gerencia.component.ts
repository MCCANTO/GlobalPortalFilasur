import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AprobarSolicitudPrestamoComponent } from '../../aprobacion-prestamo-jefatura/dialog-aprobar-solicitud/aprobar-solicitud-prestamo/aprobar-solicitud-prestamo.component';
import { RegistroPrestamoServiceService } from 'src/app/recursos-humanos/services/registro-prestamo-service.service';

import { Observable } from 'rxjs';
import { DialogApprobalConfirmComponent } from 'src/app/recursos-humanos/components/dialog-approbal-confirm/dialog-approbal-confirm.component';
import { DialogSolicitudPrestamoRechazoGerenciaComponent } from 'src/app/recursos-humanos/components/dialog-solicitud-prestamo-rechazo-gerencia/dialog-solicitud-prestamo-rechazo-gerencia.component';

@Component({
  selector: 'app-dialog-aprobar-prestamo-gerencia',
  templateUrl: './dialog-aprobar-prestamo-gerencia.component.html',
  styleUrls: ['./dialog-aprobar-prestamo-gerencia.component.css']
})



export class DialogAprobarPrestamoGerenciaComponent implements OnInit{
  motivo_rechazo_ger:string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogAprobarPrestamoGerenciaComponent>,
  private registrarPrestamo: RegistroPrestamoServiceService,

  public dialog: MatDialog){}




  ngOnInit(): void {
    this.applyDiscountToInstallments();
  }


  onApprove(): void {
    const dialogRef = this.dialog.open(DialogApprobalConfirmComponent,{
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
    const dialogRef = this.dialog.open(DialogSolicitudPrestamoRechazoGerenciaComponent,{
      data: {id_prestamo: this.data.request.id_prestamo,
            motivo_rechazo: this.motivo_rechazo_ger }
    });
    
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        console.log('Solicitud de préstamo rechazada');
        this.dialogRef.close();
      }else{
        console.log('Aprobación rechazada')
      }
    });
  }

  isApprovalComplete(): boolean {
    return this.data.request.confirmacion_gerente_rh === false && this.data.request.confirmacion_bs === true;
  }

  updateState(approved: boolean): Observable<any> {
    const data = {
      id_prestamo: this.data.request.id_prestamo,
      confirmacion_gerente_rh: approved// O cualquier campo necesario
    };
    return this.registrarPrestamo.UpdateManagerApprobalState(data);
  }

  getEstado(confirmacion_bs: boolean): string {
    return confirmacion_bs ? 'APROBADO' : 'PENDIENTE';
  }

  getMonthName(monthNumber: number): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[monthNumber - 1];
  }

  tieneDescuentoGratificacion(): boolean {
    return this.data.request.valor_descuento_julio > 0 || this.data.request.valor_descuento_diciembre > 0;
  }

  getMontoDescuentoGratificacion(): number {
    return this.data.request.valor_descuento_julio > 0 ? this.data.request.valor_descuento_julio : this.data.request.valor_descuento_diciembre;
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


  getMontosDescuentoGratificacion(): { julio: number, diciembre: number } {
    return {
      julio: this.data.request.valor_descuento_julio > 0 ? this.data.request.valor_descuento_julio : 0,
      diciembre: this.data.request.valor_descuento_diciembre > 0 ? this.data.request.valor_descuento_diciembre : 0
    };
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

