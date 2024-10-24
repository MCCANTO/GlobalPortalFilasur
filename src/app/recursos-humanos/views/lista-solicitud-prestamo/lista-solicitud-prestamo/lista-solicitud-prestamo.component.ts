import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroPrestamoServiceService } from 'src/app/recursos-humanos/services/registro-prestamo-service.service';
import { ConformidadPrestamoUsuarioComponent } from '../dialog-conformidad-usuario/conformidad-prestamo-usuario/conformidad-prestamo-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolicitudPrestamoEstadoComponent } from '../dialog-solicitud-prestamo-estado/dialog-solicitud-prestamo-estado.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DisplayColumn } from 'src/app/recursos-humanos/interfaces/task';
import { trigger, transition, query, style, animate } from '@angular/animations';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { Loan } from 'src/app/recursos-humanos/interface/loan';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DialogAprobacionEmpleadoComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-prestamo-empleado/dialog-aprobacion-empleado.component';

@Component({
  selector: 'app-lista-solicitud-prestamo',
  templateUrl: './lista-solicitud-prestamo.component.html',
  styleUrls: ['./lista-solicitud-prestamo.component.css'],
  animations: [
    trigger('animation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            style({ transform: 'translateX(0)', opacity: 1 }),
            animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
          ],
          {
            optional: true
          }
        )
      ])
    ])
  ]
})

export class ListaSolicitudPrestamoComponent implements OnInit{
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  ELEMENT_DATA!: any[];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection!: SelectionModel<any>;
  add: string = 'Add';
  edit: string = 'Edit';
  delete: string = 'Delete';
  value: string = '';
  isLoading: boolean = true;
  usercode!: string;
  rol!:string;
  

  displayedColumns: DisplayColumn[] = [
    { def: 'id_prestamo',             label: 'Id',               hide: false },
    { def: 'nombre_completo',         label: 'Nombre Completo',  hide: false },
    { def: 'area',                    label: 'Area',             hide: false },
    { def: 'puesto',                  label: 'Puesto',           hide: false },
    { def: 'monto',                   label: 'Monto',            hide: false },
    { def: 'descripcion',             label: 'Descripcion',      hide: false },
    { def: 'confirmacion_trabajador', label: 'Check Trabajador', hide: false },
    { def: 'estado',                  label: 'estado',           hide: false },
    { def: 'Bs',                      label: 'Bs',               hide: true },
    { def: 'Gerencia',                label: 'Gerencia',         hide: true },
    { def: 'action',                  label: 'Action',           hide: false },
  ];

  // Used in the template
  disColumns!: string[];

  // Use for creating check box views dynamically in the template
  checkBoxList: DisplayColumn[] = [];

  constructor(
    private _serviceListaSolicitudes: RegistroPrestamoServiceService,
    private _jwtTokenService: JwtTokenService,
    public _dialog: MatDialog
  ) {
    this.usercode = this._jwtTokenService.getUserCode();
    this.rol = this._jwtTokenService.getRol();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<any>(true, []);
    this.disColumns = this.displayedColumns.map(cd => cd.def)
    this.getAllReports()
    this.hideColumn();
  }

  getAllReports() {
    this._serviceListaSolicitudes.GetLoanApplicationCreated(this.usercode)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.dataSource.data = response as Loan[];
      })
  }

  // This function filter data by input in the search box
  applyFilter(event: any): void {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  // This function will be called when user click on select all check-box
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  ShowDetail(request: Loan) {
    this._serviceListaSolicitudes.getLoanDetails(request.id_prestamo).subscribe(
      details =>{
        const dialogRef = this._dialog.open(ConformidadPrestamoUsuarioComponent, {
          width: '600px',
          data: { request,
                  details
                }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.getAllReports();
        });
      }
    );
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  // Delete a row by 'row' delete button
  deleteRow(row_obj: any): void {
    const data = this.dataSource.data
    const index = data.findIndex((item) => item['tarea'] === row_obj['tarea']);
    if (index > -1) {
      data.splice(index, 1);
    }
    this.dataSource.data = data;
  }

  openEstadoDialog(request: any): void {
    const dialogRef = this._dialog.open(DialogSolicitudPrestamoEstadoComponent, {
      width: '500px',
      data: {
        id: request.id_prestamo,
        estadoList: this.getEstadoListForRequest(request)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
    });
  }

  getEstadoListForRequest(request: any): any[] {
    // Retorna la lista de estados para la solicitud
    return [
      { status: 'Pendiente', date: new Date('2024-07-01'), detail: 'Se registró la solicitud' },
      { status: 'En proceso', date: new Date('2024-07-01'), detail: 'La solicitud esta en proceso' }
    ];
  }

  /**
   *  Metodos para la tabla customizada
   */

  // Show/Hide check boxes
  showCheckBoxes(): void {
    this.checkBoxList = this.displayedColumns;
  }

  hideCheckBoxes(): void {
    this.checkBoxList = [];
  }

  toggleForm(): void {
    this.checkBoxList.length ? this.hideCheckBoxes() : this.showCheckBoxes();
  }

  // Show/Hide columns
  hideColumn(event?: any, item?: string) {
    this.displayedColumns.forEach(element => {
      if (element['def'] == item) {
        element['hide'] = event.checked;
      }
    });
    this.disColumns = this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def)
  }


  onConformidadChange(event: MatSlideToggleChange, element: any): void {
    // Guardamos el valor original antes de abrir el diálogo
    const originalValue = element.confirmacion_trabajador;

    // Abrimos el diálogo de confirmación
    const dialogRef = this._dialog.open(DialogAprobacionEmpleadoComponent, {
      data: { id_prestamo: element.id_prestamo },
      enterAnimationDuration: '300ms',  // Duración de la animación al abrir
      exitAnimationDuration: '350ms'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        element.confirmacion_trabajador = event.checked ? true : false;
        // Si la aprobación fue correcta, desactivar el toggle
       
      } else {
        event.source.checked = originalValue === true;
      }
    });
    element.aprobado = element.confirmacion_trabajador === false;
  }


  
}
