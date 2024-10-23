import { Component, ViewChild } from '@angular/core';
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
import { DialogAprobarPrestamoGerenciaComponent } from '../dialog-aprobar-prestamo-gerencia/dialog-aprobar-prestamo-gerencia.component';
import { AprobarSolicitudPrestamoComponent } from '../../aprobacion-prestamo-jefatura/dialog-aprobar-solicitud/aprobar-solicitud-prestamo/aprobar-solicitud-prestamo.component';

@Component({
  selector: 'app-lista-solicitud-aprobacion',
  templateUrl: './lista-solicitud-aprobacion.component.html',
  styleUrls: ['./lista-solicitud-aprobacion.component.css'],
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
export class ListaSolicitudAprobacionComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  ELEMENT_DATA!: any[];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  dataSource_ListaGeneral = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection!: SelectionModel<any>;
  countries: string[] = [];
  selectedCountry: string = 'all';
  add: string = 'Add';
  edit: string = 'Edit';
  delete: string = 'Delete';
  value: string = '';
  isLoading: boolean = true;
  id!: number | null;
  usercode!: string;
  rol!: string;
  // @Input() role!: 'Bs' | 'Gerencia'; // Nuevo parámetro de entrada

  displayedColumns: DisplayColumn[] = [
    { def: 'select', label: 'Select', hide: false },
    { def: 'id_prestamo', label: 'Id', hide: false },
    { def: 'nombre_completo', label: 'Nombre Completo', hide: false },
    { def: 'area', label: 'Area', hide: false },
    { def: 'puesto', label: 'Puesto', hide: false },
    { def: 'monto', label: 'Monto', hide: false },
    // { def: 'descripcion', label: 'Descripcion', hide: false },
    { def: 'confirmacion_trabajador', label: 'Check Trabajador', hide: false },
    { def: 'Bs', label: 'Bs', hide: false },
    { def: 'Gerencia', label: 'Gerencia', hide: false },
    { def: 'action', label: 'Action', hide: false },
  ];

  // Used in the template
  disColumns!: string[];

  // Use for creating check box views dynamically in the template
  checkBoxList: DisplayColumn[] = [];

  constructor(
    private _serviceListaSolicitudes: RegistroPrestamoServiceService,
    private _jwtTokenService:JwtTokenService,
    public dialog: MatDialog
  ) { 
    this.usercode = this._jwtTokenService.getUserCode();
    this.rol = this._jwtTokenService.getRol();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource_ListaGeneral.paginator = this.paginator;    
    this.dataSource_ListaGeneral.sort = this.sort;

    this.selection = new SelectionModel<any>(true, []);
    this.disColumns = this.displayedColumns.map(cd => cd.def)
    this.getAllGeneralReports();
    this.getAllReports();
    this.hideColumn();
    
  }

  getAllReports() {
    this._serviceListaSolicitudes.GetAllLoanApplication(this.usercode)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.dataSource.data = response as LoanRequest[];
      })
  }

  getAllGeneralReports() {
    this._serviceListaSolicitudes.GetRequestAsyncAll()
      .subscribe((response: any) => {
        this.isLoading = false;
        this.dataSource_ListaGeneral.data = response as LoanRequest[];
      })
  }

  // This function filter data by input in the search box
  applyFilter(event: any): void {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
    this.dataSource_ListaGeneral.filter = event.target.value.trim().toLowerCase();
  }

  // This function will be called when user click on select all check-box
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    const numRows2 = this.dataSource_ListaGeneral.data.length;
    return numSelected === numRows && numSelected === numRows2;
  }

  ShowDetail(request: LoanRequest) {
    const dialogRef = this.dialog.open(ConformidadPrestamoUsuarioComponent, {
      width: '900px',
      data: { request }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog');
    });
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  masterToggle2(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource_ListaGeneral.data.forEach(row => this.selection.select(row));
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
    const dialogRef = this.dialog.open(DialogSolicitudPrestamoEstadoComponent, {
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

  mostrarAprobarxGerencia() {
    const rolesPermitidos = ['admin','rh-admin', 'rh-gerencia'];
    const userRoles = this.rol.split(',').map(role => role.trim());
    return userRoles.some(userRole => rolesPermitidos.includes(userRole));
  }

  mostrarAprobarxBS() {
    const rolesPermitidos = ['admin','rh-admin', 'rh-bs'];
    const userRoles = this.rol.split(',').map(role => role.trim());
    return userRoles.some(userRole => rolesPermitidos.includes(userRole));
  }

  aprobarxGerencia(request: LoanRequest) {
    this._serviceListaSolicitudes.getLoanDetails(request.id_prestamo).subscribe(
      details => {
        const dialogRef = this.dialog.open(DialogAprobarPrestamoGerenciaComponent, {
          width:'700px',
          autoFocus: false,
          data: { request,
                  details
                }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.getAllReports();
          this.getAllGeneralReports();
        });
      }
    );
  }

  aprobarxBs(request: LoanRequest) {
    this._serviceListaSolicitudes.getLoanDetails(request.id_prestamo).subscribe(
      details => {
        const dialogRef = this.dialog.open(AprobarSolicitudPrestamoComponent, {
          width:'600px',
          autoFocus: false,
          data: {   
            request: request,
            details: details
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.getAllReports();
          this.getAllGeneralReports();
        });
      }
    );
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