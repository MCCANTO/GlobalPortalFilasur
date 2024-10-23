import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { DisplayColumn } from 'src/app/recursos-humanos/interfaces/task';
import { AdelantoSueldoServiceService } from '../../services/adelanto-sueldo-service.service';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AprobacionAdelantoRemuneracionGerenciaComponent } from '../solicitud-adelanto-remuneracion/aprobacion-adelanto-remuneracion-gerencia/aprobacion-adelanto-remuneracion-gerencia.component';
import { DialogConformidadUsuarioComponent } from '../solicitud-adelanto-remuneracion/dialog-conformidad-usuario/dialog-conformidad-usuario.component';
import { DialogSolicitudAdelantoEstadoComponent } from '../solicitud-adelanto-remuneracion/dialog-solicitud-adelanto-estado/dialog-solicitud-adelanto-estado.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DialogAprobacionAdelantoEmpleadoComponent } from '../../components/dialog-aprobacion-adelanto-empleado/dialog-aprobacion-adelanto-empleado.component';

interface AdvanceSalaryRequestManager {
  id_adelanto_sueldo: number;
  nombre_completo: string;
  monto: number;
  motivo: string;
  fecha_solicitud: string;
  confirmacion_trabajador?: boolean;
  confirmacion_bs?: boolean;
  confirmacion_gerente_rh?: boolean;
}


@Component({
  selector: 'app-lista-solicitud-adelanto-sueldo',
  templateUrl: './lista-solicitud-adelanto-sueldo.component.html',
  styleUrls: ['./lista-solicitud-adelanto-sueldo.component.css'],
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
export class ListaSolicitudAdelantoSueldoComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  ELEMENT_DATA!: any[];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection!: SelectionModel<any>;
  countries: string[] = [];
  selectedCountry: string = 'all';
  add: string = 'Add';
  edit: string = 'Edit';
  delete: string = 'Delete';
  value: string = '';
  isLoading: boolean = true;
  id!: number | null;
  usercode !: string;

  // Keep as main 'column mapper'
  displayedColumns: DisplayColumn[] = [
    { def: 'select', label: 'Select', hide: false },
    { def: 'id_adelanto_sueldo', label: 'Id Adelanto', hide: false },
    { def: 'nombre_completo', label: 'Nombre Completo', hide: false },
    { def: 'monto', label: 'Monto', hide: false },
    // { def: 'motivo', label: 'Motivo', hide: false },
    { def: 'fecha_solicitud', label: 'Fecha', hide: false },
    { def: 'empleado', label: 'Empleado', hide: false },
    { def: 'estado', label: 'Estado Solcitud', hide: false },
    { def: 'bs', label: 'Bs', hide: true },
    { def: 'gerencia', label: 'Gerencia', hide: true },
    { def: 'action', label: 'Action', hide: false }
  ];

  // Used in the template
  disColumns!: string[];

  // Use for creating check box views dynamically in the template
  checkBoxList: DisplayColumn[] = [];

  constructor(
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private _adelanto: AdelantoSueldoServiceService,
    private _jwtTokenService: JwtTokenService
  ) {
    this.usercode = this._jwtTokenService.getUserCode();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<any>(true, []);
    this.disColumns = this.displayedColumns.map(cd => cd.def)
    this.getAllReports();
    this.hideColumn();
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

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public getAllReports(): void {
    let resp = this._adelanto.GetAllAdvancedSalaryRequest(this.usercode);
    resp.subscribe((report) => {
      this.isLoading = false;
      this.dataSource.data = report as any[];
    })
  }

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

  shouldShowButtonPersonal(obj: any): boolean {
    return obj && [1].includes(obj.recurso);
  }

  shouldShowButtonMuestra(obj: any): boolean {
    return obj && [2].includes(obj.recurso);
  }

  ShowDetail(request: AdvanceSalaryRequestManager) {
    const dialogRef = this.dialog.open(DialogConformidadUsuarioComponent, {
      width: '900px',
      data: { request }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllReports();
    });
  }

  openEstadoAdelanto(request: any): void {
    const dialogRef = this.dialog.open(DialogSolicitudAdelantoEstadoComponent, {
      width: '500px',
      data: {
        id: request.id_adelanto_sueldo,
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


  onConformidadChange(event: MatSlideToggleChange, element: any): void {
    // Guardamos el valor original antes de abrir el diálogo
    const originalValue = element.confirmacion_trabajador;

    // Abrimos el diálogo de confirmación
    const dialogRef = this.dialog.open(DialogAprobacionAdelantoEmpleadoComponent,{
      data: {id_adelanto_sueldo: element.id_adelanto_sueldo},
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

  formatDate(date: string): string{
    const fechaObj = new Date(date);
    const day = String(fechaObj.getDate()).padStart(2, '0');
    const month = String (fechaObj.getMonth()+ 1).padStart(2, '0');
    const year = fechaObj.getFullYear();

    return `${day}/${month}/${year}`
  }


}
