import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';
import { MatStepper } from '@angular/material/stepper';
import { EMPTY, Observable, map, startWith, switchMap } from 'rxjs';
import { BaseService } from '../../services/base.service';
import { RegistroPrestamoServiceService } from '../../services/registro-prestamo-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { montoMaximoValidator } from '../../interface/Funx';
import { DialogApprobalAdvancedConfirmUserComponent } from '../../components/dialog-approbal-advanced-confirm-user/dialog-approbal-advanced-confirm-user.component';
import { MatDialog } from '@angular/material/dialog';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-adelanto-remuneracion',
  templateUrl: './solicitud-adelanto-remuneracion.component.html',
  styleUrls: ['./solicitud-adelanto-remuneracion.component.css']
})
export class SolicitudAdelantoRemuneracionComponent implements OnInit{
  @ViewChild('stepper') stepper?: MatStepper;
  salaryAdvanceForm: FormGroup;
  nombre_completo?: string;
  showEnviarButton: boolean = true;
  monto_adelanto!: number;
//Configuracion para mostrar motivos
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl();
  options: any[] = [];
  usercode!:string;
  isloadingComponent:boolean;
  id_prestamo!: number;

  constructor(private formBuilder: FormBuilder,
              private adelantoSueldoService:AdelantoSueldoServiceService,
              private validarSolicitud:RegistroPrestamoServiceService,
              private _jwtTokenService: JwtTokenService,
              private baseService: BaseService,
              private _snackBars: MatSnackBar,
              private _snackBar: SnackbarService,
              public dialog: MatDialog,
              private router: Router
  ) {
    this.isloadingComponent = false;
    this.salaryAdvanceForm = this.formBuilder.group({
      empleado:           [''],
      dni:                [{value: '', disabled: true}, Validators.required],
      nombre_completo:    [{value: '', disabled: true}, ], 
      id_motivo:          ['', Validators.required],
      monto:              ['', Validators.required],
      nro_cuenta_or_cci:  [{value: '', disabled: true}, ],
      correo:             [{value: '', disabled: true}],
    });
    this.usercode = this._jwtTokenService.getUserCode();
  }

  onOptionSelected(event: any): void {
    const selectedOption = this.options.find(option => option.descripcion === event.option.value);
    if (selectedOption) {
      this.salaryAdvanceForm.get('id_motivo')?.setValue(selectedOption.id_motivo);
    }
  }

  loadMotivos() {
    this.adelantoSueldoService.getAdvancedReasonsRequest().subscribe(data =>{
      this.options = data
      this.myControl.setValue('');
    });
  }

  GetLoanEmployee(empleado:string): Observable<any>{
    return this.baseService.get(`/Loan/GetAllLoanEmployeeRequest/${empleado}`)
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.loadMotivos();
    this.getMontoMaximo(this._jwtTokenService.getUserCode());
    this.loadInformacionEmpleado(this.usercode)
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this._snackBars.open(message, action, {
      duration: 5000,
      panelClass: [panelClass]
    });
  }

  confirmarSolicitud(): void {
    if (this.salaryAdvanceForm.valid) {
      const formValue = this.salaryAdvanceForm.getRawValue();
      this.isloadingComponent = true;
  
      // Primera validación contra el endpoint GetRequestStateValidation
      this.validarSolicitud.GetRequestStateValidation(formValue.empleado).pipe(
        switchMap(response => {
          this.isloadingComponent = false;
  
          if (response[0].validacion === true) {
            // Si la primera validación es true, mostrar mensaje y detener el flujo
            this.openSnackBar('No es posible registrar una nueva solicitud, ya tienes una solicitud en proceso.', 'Cerrar', 'custom-snackbar');
            return EMPTY; // Detener la secuencia aquí si no se cumple la condición
          } else {
            // Si la primera validación pasa, proceder con la segunda validación
            return this.validarSolicitud.GetRequestStateValidationAllowed(formValue.empleado);
          }
        })
      ).subscribe(
        response1 => {
          if (response1[0].validacion === false) {
            this.openSnackBar('Aún no cuentas con los requisitos mínimos para solicitar un nuevo adelanto.', 'Cerrar', 'custom-snackbar');
          } else {
            // Si ambas validaciones pasan, abrir el diálogo de confirmación
            const dialogRef = this.dialog.open(DialogApprobalAdvancedConfirmUserComponent);
  
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.onSubmit(); // Llamar a onSubmit solo si el diálogo se cierra con un resultado positivo
              }
            });
          }
        },
        error => {
          this.isloadingComponent = false;
          this._snackBar.show('Error en la validación, comunicarse con sistemas', 'red', 'white', 'center', 5000);
        }
      );
    } else {
      this._snackBar.show('Formulario inválido', 'red', 'white', 'center', 5000);
    }
  }
 
  onSubmit(): void {
     if (this.salaryAdvanceForm.valid) {
       // Aquí puedes agregar la lógica para enviar el formulario al servidor
       const formValue =  this.salaryAdvanceForm.getRawValue();
       this.nombre_completo = formValue.nombre_completo;
       this.isloadingComponent = true;

       this.adelantoSueldoService.SaveAdvanceSalary(this.salaryAdvanceForm.getRawValue()).subscribe(
         response =>{
           if (response.errorCode == 1) {
            // Mostrar ultimo paso (Mensaje de confirmacion)
            this.isloadingComponent = false;
            this.stepper?.next();
            this.id_prestamo = response.adelanto;

           } else {
            // Mostrar error y no avanzar
            this.isloadingComponent = false;
            this._snackBar.show('Oops, No se pudo registrar, recargar la pagina', 'red', 'white', 'center', 5000);
          }
         },
         error=>{
           this.isloadingComponent = false;
           this._snackBar.show('Error en el servidor, comunicarse con sistemas',  'red', 'white', 'center', 5000);
         }
       )
     } else {
       this._snackBar.show('Formulario invalido',  'red', 'white', 'center', 5000);
     }
  }

  loadInformacionEmpleado(empleado:string): void {
    this.isloadingComponent = true;
    this.adelantoSueldoService.GetLoanEmployeeAccount(empleado).subscribe(data => {
      if (data && data.length > 0) {
        this.salaryAdvanceForm.patchValue({
          empleado: empleado,
          nombre_completo: data[0].nombre,
          dni: data[0].dni,
          nro_cuenta_or_cci: data[0].nro_cuenta_or_cci,
          correo: data[0].correo
        });
        this.isloadingComponent = false;
      } else {
        this.isloadingComponent = false;
      }
    }, error => {
      this.isloadingComponent = false;
      console.error('Error fetching employee data', error);
    });
  }

  getMontoMaximo(empleado: string): void {
    this.adelantoSueldoService.GetLimitAdvanceAmount(empleado).subscribe(data => {
      if (data && data.length > 0) {
        this.monto_adelanto = data[0].monto_adelanto; // Accede al primer elemento del array
        this.salaryAdvanceForm.get('monto')?.setValidators([
          Validators.required,
          montoMaximoValidator(this.monto_adelanto)
        ]);
        this.salaryAdvanceForm.get('monto')?.updateValueAndValidity();
      } else {
        this.monto_adelanto = 0; // Maneja el caso en que la respuesta esté vacía
      }
    });
  }

  preventTyping(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete',
      'Home', 'End', 'Escape', 'Enter'
    ];
  
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  goToSolicitud(): void {
    this.router.navigate(['/recursos-humanos/lista-solicitud-adelanto']);
  }

}
