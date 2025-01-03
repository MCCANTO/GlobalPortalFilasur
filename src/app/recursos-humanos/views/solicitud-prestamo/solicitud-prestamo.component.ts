import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { EMPTY, Observable, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { montoExcedidoGratificacion, montoMaximoValidator } from '../../interface/Funx';
import { DialogApprobalConfirmUserComponent } from '../../components/dialog-approbal-confirm-user/dialog-approbal-confirm-user.component';
import { MatDialog } from '@angular/material/dialog';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { PrestamoArchivoService } from '../../services/prestamo-archivo.service';
import { DialogPolicyComponent } from '../../components/dialog-policy/dialog-policy.component';
import { SolicitudAdelantoSueldoService } from '../../services/solicitud-adelanto-sueldo.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitud-prestamo',
  templateUrl: './solicitud-prestamo.component.html',
  styleUrls: ['./solicitud-prestamo.component.css']
})
export class SolicitudPrestamoComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper?: MatStepper;
  title = 'solicitud-credito';
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  showEnviarButton: boolean = true;
  monto_limite_prestamo!: number;
  salario!: number;
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl();
  options: any[] = [];
  selectedFile: File | null = null;
  file: File | null = null;
  isloadingStep: boolean;
  files: File[] = [];
  usercode: string;
  prestamo_id!: number;

  puesto_validar!: string;

// Para empleados (meses)
  displayedColumns: string[] = ['mes', 'monto', 'gratificacion', 'total'];
  dataSource = new MatTableDataSource<any>(); // Usamos `any` porque vamos a trabajar con objetos dinámicos

// Para operarios (semanas)
displayedColumnsSemanas: string[] = ['semana', 'monto', 'gratificacion', 'total'];
//displayedColumnsSemanas: string[] = ['semana', 'monto'];
dataSourceSemanas = new MatTableDataSource<any>();

  constructor(private _formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
    private _jwtTokenService: JwtTokenService,
    private registrarPrestamo: RegistroPrestamoServiceService,
    private _prestamoArchivoService: PrestamoArchivoService,
    private validarAdelanto: AdelantoSueldoServiceService,
    private _snackBar: MatSnackBar,
    private _snackBars: SnackbarService,
    public dialog: MatDialog,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isloadingStep = false;
    this.usercode = this._jwtTokenService.getUserCode();
    /**
     *  Primer formulario (1er Paso)
     */
    this.firstFormGroup = this._formBuilder.group({
      empleado: [''],
      dni: [{ value: '', disabled: true }],
      nombre_completo: [{ value: '', disabled: true }],
      area: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],

      monto: ['', Validators.required],
      id_motivo: ['', Validators.required],
      captcha: [''],
      acceptTerms: [true, Validators.required],
    });

    /**
     *  Segun Formulario (2do Paso)
     */
    
    this.secondFormGroup = this._formBuilder.group({
      creditAmount: [{ value: '', disabled: true }, Validators.required], 
      //se quitó campo requerido para n° meses y semanas
      nro_meses_descuento: [{value: null, disabled: false}],
      nro_semanas_descuento: [{value: null, disabled: false}],
      monto_solicitado: [''],
      descuentoGratificacion: this._formBuilder.group({
        descuento_julio: [{ value: false, disabled: true }],
        descuento_diciembre: [{ value: false, disabled: true }],
        valor_descuento_julio: [{ value: '', disabled: false }],
        valor_descuento_diciembre: [{ value: '', disabled: false }]
      }),
      descuentos: this._formBuilder.array([]) // Descuentos separado en meses
    });


  }


  goToSolicitud(): void {
    this.router.navigate(['/recursos-humanos/lista-solicitud-prestamo']);
  }

  ngOnInit(): void {
    this.loadMotivos();
    this.completarInformacionEmpleadoxPrestamo(this.usercode);
    this.getMontoMaximo(this.usercode);

   /* this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.valueChanges.subscribe(value => {
      this.updateGratificationRow('Gratificación Julio', parseFloat(value || '0'));
    });
  
    this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.valueChanges.subscribe(value => {
      this.updateGratificationRow('Gratificación Diciembre', parseFloat(value || '0'));
    });
  }
  
  // Actualizar la fila de gratificación en la tabla cuando cambian los valores
  updateGratificationRow(gratificationType: string, value: number) {
    const gratificationControl = this.descuentos.controls.find(control => control.get('semana')?.value === gratificationType);
    if (gratificationControl) {
      gratificationControl.get('gratificacion')?.setValue(value);
      gratificationControl.get('total')?.setValue(value);  // Actualizar total para reflejar solo gratificación
  
      this.updateDataSourceSemanas();
    }
    */
  }

  /***********  CARGAS INICIALES (VALIDACION MONTO Y SELECT MOTIVO) *****************/
  loadMotivos() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.registrarPrestamo.getLoanReasons().subscribe(data => {
      this.options = data
      this.myControl.setValue('');
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any): void {
    const selectedOption = this.options.find(option => option.descripcion === event.option.value);
    if (selectedOption) {
      this.firstFormGroup.get('id_motivo')?.setValue(selectedOption.id_motivo);
    }
  }

  //MONTO LIMITE DE PRESTAMO A TRABAJADOR
  getMontoMaximo(empleado: string): void {
    this.registrarPrestamo.GetLoanLimitAmount(empleado).subscribe(data => {
      if (data && data.length > 0) {
        this.monto_limite_prestamo = data[0].monto_limite_prestamo;
        this.salario = data[0].salario;
        this.firstFormGroup.get('monto')?.setValidators([
          Validators.required,
          montoMaximoValidator(this.monto_limite_prestamo)
        ]);

        this.firstFormGroup.get('monto')?.updateValueAndValidity();
      }
    });
  }

  onFilesSelected(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  isValidFileType(file: File): boolean {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    return validTypes.includes(file.type);
  }

  /***********  MANEJO DE ARCHIVO - SUSTENTO *****************/
  maximoValorMeses(max: number) {
    return (control: any) => {
      const valor = control.value;
      if (valor > max) {
        return { maximoValorMeses: true };
      }
      return null;
    };
  }

  loadConfigurationSegundaPantalla(salario: Number): void {
    const creditAmountControl = this.secondFormGroup.get('monto_solicitado');
    const valorDescuentoJulioControl = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio');
    const valorDescuentoDiciembreControl = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre');

    valorDescuentoJulioControl?.setValidators([
      montoExcedidoGratificacion(this.salario, creditAmountControl!)
    ]);
    valorDescuentoJulioControl?.updateValueAndValidity();

    valorDescuentoDiciembreControl?.setValidators([
      montoExcedidoGratificacion(this.salario, creditAmountControl!)
    ]);
    valorDescuentoDiciembreControl?.updateValueAndValidity();

    // ==========Actualizar el monto de crédito y calcular descuentos
    this.actualizarMontoCredito();
    this.calculateDescuentos();
    this.calculateCuotasObrero();
  }


  get Monto(): AbstractControl | null {
    return this.firstFormGroup.get('monto');
  }

  completarInformacionEmpleadoxPrestamo(empleado: string) {
    //console.log('codigo empleado', empleado)
    this.isloadingStep = true;
    this.registrarPrestamo.GetLoanEmployee(empleado).subscribe(data => {
      
      if (data && data.length > 0) {
        this.firstFormGroup.patchValue({
          empleado: empleado,
          nombre_completo: data[0].nombre,
          dni: data[0].dni,
          area: data[0].area,
          puesto: data[0].puesto,
          correo: data[0].correo
        });
      }
      this.puesto_validar = data[0].puesto;
      this.isloadingStep = false
    }, error => {
      console.error('Error fetching employee data', error);
      this.isloadingStep = false
    });
  }

  GrabarSolicitud(): void {
    // if (this.secondFormGroup.get('nro_meses_descuento')?.value) {
      
    // }

    const dialogRef = this.dialog.open(DialogApprobalConfirmUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

 toggleDescuentoJulio(value: boolean) {

    const isOperario = this.puesto_validar && this.puesto_validar.toLowerCase().includes('operario');
    const valorDescuentoJulio = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio');

    if(isOperario){
      if (value) {
        valorDescuentoJulio?.enable();
      } else {
        valorDescuentoJulio?.setValue(null); // Limpia el valor
        valorDescuentoJulio?.disable();
      }
      valorDescuentoJulio?.updateValueAndValidity();
      this.calculateCuotasObrero();
    }else{
      if (value) {
        valorDescuentoJulio?.enable();
      } else {
        valorDescuentoJulio?.setValue(null); // Limpia el valor
        valorDescuentoJulio?.disable();
      }
      valorDescuentoJulio?.updateValueAndValidity();
      this.calculateDescuentos();
    }
  
  }

  toggleDescuentoDiciembre(value: boolean) {
    const isOperario = this.puesto_validar && this.puesto_validar.toLowerCase().includes('operario');
    const valorDescuentoDiciembre = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre');

    if(isOperario){
      if (value) {
        valorDescuentoDiciembre?.enable();
      } else {
        valorDescuentoDiciembre?.setValue(null); // Limpia el valor
      valorDescuentoDiciembre?.disable();
      }
      valorDescuentoDiciembre?.updateValueAndValidity();
      this.calculateCuotasObrero();
    }else{
      if (value) {
        valorDescuentoDiciembre?.enable();
      } else {
        valorDescuentoDiciembre?.setValue(null); // Limpia el valor
      valorDescuentoDiciembre?.disable();
      }
      valorDescuentoDiciembre?.updateValueAndValidity();
      this.calculateDescuentos();
    }

    
  }



  onSubmit() {
    const isOperario = this.puesto_validar && this.puesto_validar.toLowerCase().includes('operario');
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.isloadingStep = true;

      //console.log('formStep1', this.firstFormGroup.value)
      console.log('formStep2', this.secondFormGroup.value)
      

      
      const formValue = {
        ...this.firstFormGroup.getRawValue(),
        //monto: this.secondFormGroup.get('creditAmount')?.value,
        ...this.secondFormGroup.value,
        descuento_julio: this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.value ? true : false,
        valor_descuento_julio: this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || 0,
        descuento_diciembre: this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.value ? true : false,
        valor_descuento_diciembre: this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || 0,
        
        descuentos: this.descuentos.controls
          .filter(control => control.value.anio !== undefined)//evitar tomar en cuenta valores año de gratificaciones 
          .map((control) => {      
            return {
              numero: control.value.numero,
              anio: control.value.anio.toString(),
              valor_descuento: control.value.monto
            };            
          })
      };
      
      this.registrarPrestamo.RegistrarPrestamo(formValue).subscribe(
        response => {
          this.isloadingStep = false;

          // Grabar las solicitudes
          this.prestamo_id = response.prestamo;
          this.uploadFiles(response.prestamo, this.files);
        },
        error => {
          this.isloadingStep = false;
          console.error('Error al registrar', error);
          this._snackBar.open(`Error al registrar: ${error.message}`, 'Cerrar', {
            duration: 5000,
          });
        }
      )

    } else {
      //console.log('Formulario no válido');
    }
    this.showEnviarButton = false;
  }

  uploadFiles(solicitudId: string, files: File[]) {
    this._prestamoArchivoService.saveArchivosxPrestamo(this.usercode, parseInt(solicitudId), files).subscribe(response => {
      // Manejar la respuesta de la subida de archivos
      this.stepper?.next();
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  get descuentos(): FormArray {
    return this.secondFormGroup.get('descuentos') as FormArray;
  }

  addDescuentoFieldsEmpleado(numeroMeses: number, startMonth: number, startYear: number, montoPorMes: number) {
    const startDate = new Date(startYear, startMonth );
    this.descuentos.clear();


    for (let i = 0; i < numeroMeses; i++) { // Consideraremos desde el 1 (mes siguiente)
      const newDate = new Date(startDate);
      newDate.setMonth(startDate.getMonth() + i);
      
      const mesActualizado = newDate.getMonth() ; 
      const { mes, descripcion, anio } = this.getNumeroMesyDescripcion(newDate);

      console.log('fecha inicio', newDate)
      console.log('Meses add', mes)
      console.log('Numero mes',this.getNumeroMesyDescripcion(newDate))
        
      
      /*Agregar monto ingresado en gratificacion julio/diciembre en cuotas/mes */
      let gratificacion = 0;
      if(mes === 7){
        gratificacion = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || '0');
      }else if (mes === 12){
        gratificacion = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || '0')
      }

      const total = (montoPorMes + gratificacion).toFixed(2);

      this.descuentos.push(this._formBuilder.group({
        numero: [mes],
        mes: [descripcion],
        anio: [anio],
        monto: [montoPorMes],
        gratificacion: [gratificacion], //nuevo campo agregado para contabilizar gratificación en cuotas/mes
        total: [total] //nuevo campo agregado para sumar gratificacion + total
      }));
    }

      // Actualizar el dataSource con los controles del FormArray
  //this.dataSource.data = this.descuentos.controls;

  this.dataSource.data = this.descuentos.controls.map(control => ({
    mes: control.get('mes')?.value,
    monto: control.get('monto')?.value,
    gratificacion: control.get('gratificacion')?.value,
    total: control.get('total')?.value
  }));
    //this.changeDetectorRef.detectChanges();
  }

  getNumeroMesyDescripcion(date: Date): any {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const numeroMes = date.getMonth() + 1;
    return { mes: numeroMes, descripcion: `${month} ${year}`, anio: year };
    
  }

  calculateDescuentosGeneral() {
    const isOperario = this.puesto_validar && this.puesto_validar.toLowerCase().includes('operario');
  
  if (isOperario) {
    const numeroSemanas = this.secondFormGroup.get('nro_semanas_descuento')?.value;
    if (numeroSemanas) {
      this.calculateCuotasObrero();
      //this.updateDataSourceSemanas(); // Actualiza la tabla de semanas
    }
  } else {
    const numeroMeses = this.secondFormGroup.get('nro_meses_descuento')?.value;
    if (numeroMeses) {
      this.calculateDescuentos();
      //this.updateDataSourceMeses(); // Actualiza la tabla de meses
    }
  }
  }


  updateDataSourceMeses() {
    this.dataSource.data = this.descuentos.controls.map(control => ({
      mes: control.get('mes')?.value,
      monto: control.get('monto')?.value,
      gratificacion: control.get('gratificacion')?.value,
      total: control.get('total')?.value
    }));
  }
  
  // Actualiza el dataSource para operarios (semanas)


  calculateDescuentos() {
    // Habilitar o Deshabilitar los checkbox de Gratificacion
    const creditAmount = this.firstFormGroup.get('monto')?.value;

    const numeroMeses = this.secondFormGroup.get('nro_meses_descuento')?.value;

    //Validación para inactivar controles mat-checkbox si el valor nro_meses_descuento es limpiado
    const descuentoJulioControl = this.secondFormGroup.get('descuentoGratificacion.descuento_julio');
    const descuentoDiciembreControl = this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre');
    const valorDescuentoJulioControl = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio');
    const valorDescuentoDiciembreControl = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre');

    //console.log("Número de meses ingresado:", numeroMeses); // Debug

    if (!numeroMeses || numeroMeses < 1  || numeroMeses > 12  || numeroMeses == '') {
      //Limpiar controles checkbox e input gratificación
      descuentoJulioControl?.disable();
      descuentoJulioControl?.setValue(false); // Desmarcar checkbox
      valorDescuentoJulioControl?.reset(); // Limpiar valor del input de descuento de julio
      descuentoDiciembreControl?.disable();
      descuentoDiciembreControl?.setValue(false); // Desmarcar checkbox
      valorDescuentoDiciembreControl?.reset();
      //Limpiar tabla dinámica
      this.descuentos.clear();
      return;
    }

    if (creditAmount && numeroMeses) {
      let montoRestante = creditAmount;

      const descuentoJulio = this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.value;
      const valorDescuentoJulio = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || '0');

      if (descuentoJulio) {
        montoRestante -= valorDescuentoJulio;
      }

      const descuentoDiciembre = this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.value;
      const valorDescuentoDiciembre = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || '0');

      if (descuentoDiciembre) {
        montoRestante -= valorDescuentoDiciembre;
      }

      const montoPorMes = (montoRestante / numeroMeses).toFixed(2);
      const currentDate = new Date();
      const startMonth = currentDate.getMonth()+1; // Siguiente mes
      const startYear = currentDate.getFullYear();
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + numeroMeses);

      //console.log("Fecha final (endDate):", endDate); // Debug

      // Fechas de julio y diciembre del año actual y del siguiente
      const julioActual = new Date(currentDate.getFullYear(), 6, 1); // Julio es el mes 6
      const julioSiguiente = new Date(currentDate.getFullYear() + 1, 6, 1);
      const diciembreActual = new Date(currentDate.getFullYear(), 11, 1); // Diciembre es el mes 11
      const diciembreSiguiente = new Date(currentDate.getFullYear() + 1, 11, 1);

      // Función para verificar si una fecha está en el rango
      const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
        return date >= startDate && date <= endDate;
      };

      // Verificar si julio y diciembre están en el rango
      const enableCheckboxJulio = isDateInRange(julioActual, currentDate, endDate) || isDateInRange(julioSiguiente, currentDate, endDate);
      const enableCheckboxDiciembre = isDateInRange(diciembreActual, currentDate, endDate) || isDateInRange(diciembreSiguiente, currentDate, endDate);

      // Habilitar y deshabilitar  
      if (enableCheckboxJulio) {
        this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.enable();
      } else {
        this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.disable();
      }

      if (enableCheckboxDiciembre) {
        this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.enable();
      } else {
        this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.disable();

      }


      this.addDescuentoFieldsEmpleado(numeroMeses, startMonth, startYear, parseFloat(montoPorMes));


      /* NUEVA COLUMNA DE GRATIFICACION PARA GENERACIÓN DE CUOTAS/MES Y ACTUALIZACIÓN DEL TOTAL */
    this.descuentos.controls.forEach((control, index) => {
      const mes = control.get('numero')?.value;
      

      //console.log('Mes generado:', mes);

      let gratificacion = 0;

      if (mes == 6) {
        gratificacion = valorDescuentoJulio;
      } else if (mes == 11) {
        gratificacion = valorDescuentoDiciembre;
      } 

      control.get('gratificacion')?.setValue(gratificacion);

      // Actualizar el total (cuota mensual + gratificación)
      const montoPorMes = parseFloat(control.get('monto')?.value);
      const total = (montoPorMes + gratificacion).toFixed(2);
      control.get('total')?.setValue(total);
    });
    //console.log("Descuentos generados:", this.descuentos.controls.length);
    }
  }




//VALIDACION PARA CÁCULO DE CUOTAS X SEMANA - CASO OPERARIO

calculateCuotasObrero() {
  const creditAmount = this.firstFormGroup.get('monto')?.value;
  const numeroSemanas = this.secondFormGroup.get('nro_semanas_descuento')?.value; // 4 semanas por mes (aprox.)

  //Validación para inactivar controles mat-checkbox si el valor nro_meses_descuento es limpiado
  const descuentoJulioControl = this.secondFormGroup.get('descuentoGratificacion.descuento_julio');
  const descuentoDiciembreControl = this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre');
  const valorDescuentoJulioControl = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio');
  const valorDescuentoDiciembreControl = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre');
  
  
  if (!numeroSemanas || numeroSemanas < 1 || numeroSemanas > 30 || numeroSemanas == null) {
    //Limpiar controles checkbox e input gratificación
    descuentoJulioControl?.disable();
    descuentoJulioControl?.setValue(false); // Desmarcar checkbox
    valorDescuentoJulioControl?.reset(); // Limpiar valor del input de descuento de julio
    descuentoDiciembreControl?.disable();
    descuentoDiciembreControl?.setValue(false); // Desmarcar checkbox
    valorDescuentoDiciembreControl?.reset();
    //Limpiar tabla dinámica
    this.descuentos.clear();
    return;
  }

  if(creditAmount && numeroSemanas){
    let montoRestante = creditAmount

    const descuentoJulio = this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.value;
    const valorDescuentoJulio = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || '0');

    if (descuentoJulio) {
      montoRestante -= valorDescuentoJulio;
    }

    const descuentoDiciembre = this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.value;
    const valorDescuentoDiciembre = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || '0');

    if (descuentoDiciembre) {
      montoRestante -= valorDescuentoDiciembre;
    }


  const montoPorSemana = (montoRestante / numeroSemanas).toFixed(2);
  const currentDate = new Date();
  const startWeek = this.getNextWeek(currentDate);
  const endDate = new Date(currentDate);
  endDate.setDate(currentDate.getDate() + (numeroSemanas * 7));

  const julio= 6;
  const diciembre= 11;
  const isMonthInRange = (date: Date, month: number): boolean =>{
    return date.getMonth() === month && date >= currentDate && date <= endDate;
  };

// Verificar si julio y diciembre están en el rango de semanas generadas
const enableCheckboxJulio = isMonthInRange(new Date(currentDate.getFullYear(), julio, 1), julio) ||isMonthInRange(new Date(currentDate.getFullYear() + 1, julio, 1), julio);
const enableCheckboxDiciembre = isMonthInRange(new Date(currentDate.getFullYear(), diciembre, 1), diciembre) || isMonthInRange(new Date(currentDate.getFullYear() + 1, diciembre, 1), diciembre);


// Habilitar y deshabilitar los checkboxes de descuento de gratificación
if (enableCheckboxJulio) {
  this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.enable();
} else {
  this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.disable();
}

if (enableCheckboxDiciembre) {
  this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.enable();
} else {
  this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.disable();
}



  this.addDescuentoFieldsObrero(numeroSemanas, startWeek, parseFloat(montoPorSemana));
  //console.log("Descuentos (Meses):", this.descuentos.value); 

 // Actualizar los campos de gratificación en las semanas correspondientes
 /*
 this.descuentos.controls.forEach((control, index) => {

  const weekDate = new Date(currentDate);
  weekDate.setDate(currentDate.getDate() + (index * 7));

  let gratificacion = 0;
  if (weekDate.getMonth() === julio) {
    gratificacion = valorDescuentoJulio;
  } else if (weekDate.getMonth() === diciembre) {
    gratificacion = valorDescuentoDiciembre;
  }
  
  control.get('gratificacion')?.setValue(gratificacion);

  // Actualizar el total (monto semanal + gratificación)

  const montoPorSemana = parseFloat(control.get('monto')?.value);
  const total = (montoPorSemana + gratificacion).toFixed(2);
  control.get('total')?.setValue(total);
});*/

this.addGratificationRows(valorDescuentoJulio, valorDescuentoDiciembre);

  }
}

addDescuentoFieldsObrero(numeroSemanas: number, startDate: Date, montoPorSemana: number) {
  this.descuentos.clear();

  for (let i = 0; i < numeroSemanas; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + (i * 7)); // Sumar una semana

    const semana = this.getWeekNumber(newDate);
    const anio = newDate.getFullYear();
    const mes = this.getMonthName(newDate);
    
    const descripcion = `${mes}, Semana ${semana}, ${anio}`;



   
    //Condicional para sumar cantidad de gratificacion en fechas julio/diciembre- no aplica para obrero

    let gratificacion = 0;
    /*
    if(semana ===28 && this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.value){

      gratificacion = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value ||'0');
    }
    else if (semana === 48 && this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.value){

      gratificacion = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || '0')
    }*/

    const total = (montoPorSemana+gratificacion).toFixed(2);

    this.descuentos.push(this._formBuilder.group({
      semana: [descripcion],
      numero: [semana],
      anio: [anio],
      monto: [montoPorSemana],
      gratificacion: [gratificacion],
      total: [total]
    }));
  }
  //this.dataSourceSemanas.data = this.descuentos.controls;
  this.dataSourceSemanas.data = this.descuentos.controls.map(control => ({
    semana: control.get('semana')?.value,
    monto: control.get('monto')?.value,
    gratificacion: control.get('gratificacion')?.value,
    total: control.get('total')?.value
  }));

}

addGratificationRows(valorDescuentoJulio: number, valorDescuentoDiciembre: number) {
  // Agregar gratificación de julio
  const gratificacionJulio = this._formBuilder.group({
    semana: ['Gratificación Julio'],
    monto: [0],
    gratificacion: [valorDescuentoJulio],
    total: [valorDescuentoJulio]
  });
  this.descuentos.push(gratificacionJulio);

  // Agregar gratificación de diciembre
  const gratificacionDiciembre = this._formBuilder.group({
    semana: ['Gratificación Diciembre'],
    monto: [0],
    gratificacion: [valorDescuentoDiciembre],
    total: [valorDescuentoDiciembre]
  });
  this.descuentos.push(gratificacionDiciembre);

  this.updateDataSourceSemanas();
}

updateDataSourceSemanas() {
  this.dataSourceSemanas.data = this.descuentos.controls.map(control => ({
    semana: control.get('semana')?.value,
    monto: control.get('monto')?.value,
    gratificacion: control.get('gratificacion')?.value,
    total: control.get('total')?.value
  }));
}

getNextWeek(date: Date): Date {
  const nextWeek = new Date(date);
  nextWeek.setDate(date.getDate() + (7 - date.getDay())); // Siguiente lunes
  return nextWeek;
}

getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;

  return Math.floor((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
}

getMonthName(date: Date): string {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[date.getMonth()];
}



  openSnackBar(message: string, action: string, panelClass: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: [panelClass]
    });
  }

  //En este apartado se valida creación de solicitudes bajo 2 condiciones:
  //- Fecha de ingreso mayor a 3 meses para poder registrar
  //- Registro de solo una solicitud
  nextStep(): void {
    // if (this.files.length === 0) {
    //   this.openSnackBar('Usted necesita adjuntar al menos 1 documento', 'Cerrar', 'custom-snackbar');
    //   return;
    // }
  
    if (this.firstFormGroup.valid) {
      const empleado = this.firstFormGroup.get('empleado')?.value;
  
      // Validar sino tiene una solicitud de adelanto de sueldo existente
      this.validarAdelanto.GetRequestStateValidationAdvance(empleado).pipe(
        switchMap(response => {
          if (response && response === true) {
            this.openSnackBar('No es posible registrar una nueva solicitud, ya tienes una solicitud en proceso.', 'Cerrar', 'custom-snackbar');
            return EMPTY;
          } else {
            return this.registrarPrestamo.GetRequestStateValidationAllowed(empleado);
          }
        })
      ).subscribe( 
          response1 => {
            if(response1[0].validacion === false){
              this.openSnackBar('Aún no cuentas con los requisitos mínimos para solicitar una nuevo préstamo.', 'Cerrar', 'custom-snackbar');
            }else{
              //Validacion puesto de usuario para proceder con descuentos mensual/semanal
              if(!this.puesto_validar.toLowerCase().includes('operario')){
                this.secondFormGroup.get('nro_meses_descuento')?.valueChanges.subscribe(() => {
                  this.calculateDescuentos();
                });
              }else{
                this.secondFormGroup.get('nro_semanas_descuento')?.valueChanges.subscribe(() => {
                  this.calculateCuotasObrero();
                });
              }
              
    
              this.loadConfigurationSegundaPantalla(this.salario);
    
              // Trasladar valor de Monto solicitado de primer Step
              this.secondFormGroup.patchValue({
                creditAmount: this.firstFormGroup.get('monto')?.value,
                monto_solicitado: this.firstFormGroup.get('monto')?.value
              });
    
              this.stepper?.next();
            }
          },
        error => {
          this._snackBars.show('Error en la validación, comunicarse con sistemas', 'red', 'white', 'center', 5000);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  nextStep2() {
    if (this.secondFormGroup.valid) {
      this.stepper?.next();
    } else {
      //console.log('Formulario del Paso 2 no válido');
    }
  }

  actualizarMontoCredito() {
    const isOperario = this.puesto_validar && this.puesto_validar.toLowerCase().includes('operario');
    let montoOriginal = this.firstFormGroup.get('monto')?.value || 0;
    let montoRestante = montoOriginal;

    const descuentoJulio = this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.value;
    const valorDescuentoJulio = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || '0');

    if (descuentoJulio) {
      montoRestante -= valorDescuentoJulio;
    }

    const descuentoDiciembre = this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.value;
    const valorDescuentoDiciembre = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || '0');

    if (descuentoDiciembre) {
      montoRestante -= valorDescuentoDiciembre;
    }

    this.secondFormGroup.get('creditAmount')?.setValue(montoRestante, { emitEvent: false });
    //Se agregan las funciones para recalcular la cuota x mes | cuota x semana
    //Se quitó el calculo para obrero porque se agregará el campo al final de las cuotas
    if(isOperario){
      this.calculateCuotasObrero();
    }else{
      this.calculateDescuentos();
    }
  }

  openDialogTerminosCondiciones() {
    this.dialog.open(DialogPolicyComponent,{
       width:'1000px'
    });
  }

  ngAfterViewInit() {
    const headers = document.querySelectorAll('.mat-horizontal-stepper-header');
    headers.forEach(header => {
      (header as HTMLElement).style.pointerEvents = 'none';
    });
  }

/*BLOQUEAR ESCRIBIR MOTIVOS*/
preventTyping(event: KeyboardEvent): void {
  const allowedKeys = [
    'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete',
    'Home', 'End', 'Escape', 'Enter'
  ];

  if (!allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

preventTextInput(event: InputEvent): void {
  // Bloquea cualquier cambio que no provenga de las teclas permitidas
  const inputElement = event.target as HTMLInputElement;
  const previousValue = inputElement.value;
  setTimeout(() => {
    inputElement.value = previousValue; // Revertir el cambio para evitar cualquier ingreso de texto
  });
}

//LIMITAR EL VALOR INGRESADO EN N° DE MESES A 12 

validateMonths(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  let value = parseInt(inputElement.value, 10);

  if (value > 12) {
    inputElement.value = '12';  // Si el número es mayor a 12, se ajusta a 12
    value = 12;
  } else if (value < 0) {
    inputElement.value = '0';  // Si el número es menor a 0, se ajusta a 0
    value = 0;
  }

  this.secondFormGroup.get('nro_meses_descuento')?.setValue(value);
  this.toggleDescuentoCheckboxes(value);
  
}


toggleDescuentoCheckboxes(value: number): void {
  const currentMonth = new Date().getMonth() + 1; // Mes actual (1 para Enero, 12 para Diciembre)

  const includesJulio = (currentMonth + value - 1) >= 7 && (currentMonth + value - 1) <= 12; // Revisa si incluye Julio
  const includesDiciembre = (currentMonth + value - 1) >= 12 || currentMonth <= 12 - value + 1; // Revisa si incluye Diciembre

  // Desactiva Julio si no está en el rango
  if (!includesJulio) {
    this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.setValue(false);
    this.toggleDescuentoJulio(false);
  }

  // Desactiva Diciembre si no está en el rango
  if (!includesDiciembre) {
    this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.setValue(false);
    this.toggleDescuentoDiciembre(false);
  }
}

onContinue(): void {
  if (this.firstFormGroup.valid) {
    const empleado = this.firstFormGroup.get('empleado')?.value;

    this.validarAdelanto.GetRequestStateValidationAdvance(empleado).subscribe(
      response => {
        if (response && response === true) { 
          
          this._snackBars.show('No puedes continuar con la solicitud de adelanto.', 'red', 'white', 'center', 5000);
        } else {
          this.stepper!.next();
        }
      },
      error => {
        this._snackBars.show('Error en la validación, comunicarse con sistemas', 'red', 'white', 'center', 5000);
      }
    );
  } else {
    this._snackBars.show('Formulario inválido', 'red', 'white', 'center', 5000);
  }
}

}
