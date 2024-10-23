import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AdelantoSueldoServiceService } from 'src/app/recursos-humanos/services/adelanto-sueldo-service.service';
import { AprobacionAdelantoRemuneracionJefaturaComponent } from '../aprobacion-adelanto-remuneracion-jefatura/aprobacion-adelanto-remuneracion-jefatura.component';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DisplayColumn } from 'src/app/recursos-humanos/interfaces/task';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { DialogAprobacionAdelantoGerenciaComponent } from 'src/app/recursos-humanos/components/dialog-aprobacion-adelanto-gerencia/dialog-aprobacion-adelanto-gerencia.component';
import { AprobacionAdelantoRemuneracionGerenciaComponent } from '../aprobacion-adelanto-remuneracion-gerencia/aprobacion-adelanto-remuneracion-gerencia.component';
import { DialogSolicitudAdelantoEstadoComponent } from '../dialog-solicitud-adelanto-estado/dialog-solicitud-adelanto-estado.component';

@Component({
  selector: 'app-lista-adelanto-remuneracion-jefatura',
  templateUrl: './lista-adelanto-remuneracion-jefatura.component.html',
  styleUrls: ['./lista-adelanto-remuneracion-jefatura.component.css'],
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


export class ListaAdelantoRemuneracionJefaturaComponent implements OnInit{
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


  displayedColumns: DisplayColumn[] = [
    { def: 'select', label: 'Select', hide: false },
    { def: 'id_adelanto_sueldo', label: 'Id', hide: false },
    { def: 'nombre_completo', label: 'Nombre Completo', hide: false },
    { def: 'monto', label: 'Area', hide: false },
    { def: 'motivo', label: 'Puesto', hide: false },
    { def: 'fecha_solicitud', label: 'Monto', hide: false },
    { def: 'confirmacion_trabajador', label: 'Descripcion', hide: false },
    { def: 'Bs', label: 'Check Trabajador', hide: false },
    { def: 'Gerencia', label: 'Gerencia', hide: false },
    { def: 'action', label: 'Action', hide: false },
  ];
  disColumns!: string[];

  checkBoxList: DisplayColumn[] = [];

  constructor(
    private _serviceListaSolicitudes: AdelantoSueldoServiceService,
    private _jwtTokenService:JwtTokenService,
    public dialog: MatDialog  ) 
    {
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
    //this.loadApprovalEmployeeRequest();
    this.getAllGeneralReports();
    this.getAllReports();
  }


    loadApprovalEmployeeRequest() {
      this._serviceListaSolicitudes.GetAdvancedSalaryRequestSupervisor()
      .subscribe((response:any) => {
        console.log(response)
        this.isLoading = false;
        this.dataSource.data = response as AdvanceSalaryRequest[];
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
      const numRows1 = this.dataSource_ListaGeneral.data.length;
      return numSelected === numRows && numSelected === numRows1;
    }

    aprobarxGerencia(request: AdvanceSalaryRequest) {
      const dialogRef = this.dialog.open(AprobacionAdelantoRemuneracionGerenciaComponent, {
        width:'900px',
        autoFocus: false,
        data: { request }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getAllReports();
        this.getAllGeneralReports();
      });
    }

    aprobarxBs(request: AdvanceSalaryRequest) {
    const dialogRef = this.dialog.open(AprobacionAdelantoRemuneracionJefaturaComponent, {
      width:'900px',
      autoFocus: false,
      data: { request }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllReports();
      this.getAllGeneralReports();
    });
}

getAllReports() {
  this._serviceListaSolicitudes.getSolicitudesAdelantoSueldoAprobar(this.usercode)
    .subscribe((response: any) => {
      this.isLoading = false;
      this.dataSource.data = response as AdvanceSalaryRequest[];
    })
}

getAllGeneralReports() {
  this._serviceListaSolicitudes.getSolicitudesGeneralAdelantoSueldo()
    .subscribe((response: any) => {
      this.isLoading = false;
      this.dataSource_ListaGeneral.data = response as AdvanceSalaryRequest[];
    })
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
    { status: 'Pendiente', date: new Date('2024-08-01'), detail: 'Se registró la solicitud' },
    { status: 'En proceso', date: new Date('2024-08-01'), detail: 'La solicitud esta en proceso' }
  ];
}

masterToggle(): void {
  this.isAllSelected()
    ? this.selection.clear()
    : this.dataSource.data.forEach(row => this.selection.select(row));
}

masterToggle1(): void {
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


 

}

interface AdvanceSalaryRequest {
  id_adelanto_sueldo: number;
  nombre_completo: string;
  monto: number;
  motivo: string;
  fecha_solicitud?: string;
  confirmacion_trabajador?: boolean;
  confirmacion_bs?: boolean;
  confirmacion_gerente_rh?: boolean;
}
