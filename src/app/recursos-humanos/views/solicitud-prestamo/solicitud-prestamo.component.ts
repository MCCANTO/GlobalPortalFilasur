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


  displayedColumns: string[] = ['mes', 'monto', 'gratificacion', 'total'];
  dataSource = new MatTableDataSource<any>(); // Usamos `any` porque vamos a trabajar con objetos dinámicos


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
      nro_meses_descuento: [{value: null, disabled: false}, Validators.required],
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

  trackByFn(index: number, item: any) {
    return index; // O algún identificador único del objeto
  }

  goToSolicitud(): void {
    this.router.navigate(['/recursos-humanos/lista-solicitud-prestamo']);
  }

  ngOnInit(): void {
    this.loadMotivos();
    this.completarInformacionEmpleadoxPrestamo(this.usercode);
    this.getMontoMaximo(this.usercode);

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
    const creditAmountControl = this.secondFormGroup.get('creditAmount');
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
      this.isloadingStep = false
    }, error => {
      console.error('Error fetching employee data', error);
      this.isloadingStep = false
    });
  }

  GrabarSolicitud(): void {
    if (this.secondFormGroup.get('nro_meses_descuento')?.value) {
      
    }

    const dialogRef = this.dialog.open(DialogApprobalConfirmUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

 toggleDescuentoJulio(value: boolean) {
    const valorDescuentoJulio = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio');
    if (value) {
      valorDescuentoJulio?.enable();
    } else {
      valorDescuentoJulio?.setValue(null); // Limpia el valor
      valorDescuentoJulio?.disable();
    }
    valorDescuentoJulio?.updateValueAndValidity();
    this.calculateDescuentos();
  }

  toggleDescuentoDiciembre(value: boolean) {
    const valorDescuentoDiciembre = this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre');
    if (value) {
      valorDescuentoDiciembre?.enable();
    } else {
      valorDescuentoDiciembre?.setValue(null); // Limpia el valor
    valorDescuentoDiciembre?.disable();
    }
    valorDescuentoDiciembre?.updateValueAndValidity();
    this.calculateDescuentos();
  }



  onSubmit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.isloadingStep = true;
      const formValue = {
        ...this.firstFormGroup.getRawValue(),
        //monto: this.secondFormGroup.get('creditAmount')?.value,
        ...this.secondFormGroup.value,
        descuento_julio: this.secondFormGroup.get('descuentoGratificacion.descuento_julio')?.value ? true : false,
        valor_descuento_julio: this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || 0,
        descuento_diciembre: this.secondFormGroup.get('descuentoGratificacion.descuento_diciembre')?.value ? true : false,
        valor_descuento_diciembre: this.secondFormGroup.get('descuentoGratificacion.valor_descuento_diciembre')?.value || 0,

        descuentos: this.descuentos.controls.map((control) => {
          return {
            mes: control.value.numero + 1,
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
      console.log('Formulario no válido');
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

  addDescuentoFields(numeroMeses: number, startMonth: number, startYear: number, montoPorMes: number) {
    const startDate = new Date(startYear, startMonth );
    this.descuentos.clear();


    for (let i = 0; i < numeroMeses; i++) { // Consideraremos desde el 1 (mes siguiente)
      const newDate = new Date(startDate);
      newDate.setMonth(startDate.getMonth() + i);
      
      const mesActualizado = newDate.getMonth() ; 
      const { mes, descripcion, anio } = this.getNumeroMesyDescripcion(newDate);
      
 
      /*Agregar monto ingresado en gratificacion julio/diciembre en cuotas/mes */
      let gratificacion = 0;
      if(mes === 6){
        gratificacion = parseFloat(this.secondFormGroup.get('descuentoGratificacion.valor_descuento_julio')?.value || '0');
      }else if (mes === 11){
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
  this.dataSource.data = this.descuentos.controls;
    this.changeDetectorRef.detectChanges();
  }

  getNumeroMesyDescripcion(date: Date): any {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return { mes: date.getMonth(), descripcion: `${month} ${year}`, anio: year };
    
  }

  calculateDescuentos() {
    // Habilitar o Deshabilitar los checkbox de Gratificacion
    const creditAmount = this.firstFormGroup.get('monto')?.value;

    const numeroMeses = this.secondFormGroup.get('nro_meses_descuento')?.value;
    console.log("Número de meses ingresado:", numeroMeses); // Debug

    if (!numeroMeses || numeroMeses < 1  || numeroMeses > 12  || numeroMeses == '') {
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

      console.log("Fecha inicial:", startMonth, startYear);

      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + numeroMeses);

      console.log("Fecha final (endDate):", endDate); // Debug

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


      this.addDescuentoFields(numeroMeses, startMonth, startYear, parseFloat(montoPorMes));


      /* NUEVA COLUMNA DE GRATIFICACION PARA GENERACIÓN DE CUOTAS/MES Y ACTUALIZACIÓN DEL TOTAL */
    this.descuentos.controls.forEach((control, index) => {
      const mes = control.get('numero')?.value;
      

      console.log('Mes generado:', mes);

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
    console.log("Descuentos generados:", this.descuentos.controls.length);
    }
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
    if (this.files.length === 0) {
      this.openSnackBar('Usted necesita adjuntar al menos 1 documento', 'Cerrar', 'custom-snackbar');
      return;
    }
  
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
              this.secondFormGroup.get('nro_meses_descuento')?.valueChanges.subscribe(() => {
                this.calculateDescuentos();
              });
    
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
      console.log('Formulario del Paso 2 no válido');
    }
  }

  actualizarMontoCredito() {
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
    this.calculateDescuentos();
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
