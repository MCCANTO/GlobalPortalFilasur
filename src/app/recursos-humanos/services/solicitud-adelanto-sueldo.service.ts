import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudAdelantoSueldoService {

  constructor(private _baseService:BaseService) {  }

 

  getSolicitudesAdelantoSueldo(): Observable<any> {
    return this._baseService.get(`/adelanto-sueldo/GetAllAdvancedSalaryRequest`);
  }

  saveSolicitud(data: any): Observable<any> {
    return this._baseService.post(`/adelanto-sueldo/saveSolicitud`, data, true);
  }

  updateSolicitud(data: any): Observable<any> {
    return this._baseService.put(`/adelanto-sueldo/updateSolicitud`, data, true);
  }

  deleteSolicitud(id: number): Observable<any> {
    return this._baseService.delete(`/adelanto-sueldo/deleteSolicitud/${id}`, true);
  }

  updateSolicitudAdelantoEstado(data: any): Observable<any> {
    return this._baseService.put(`/adelanto-sueldo/UpdateAdvanceSalaryStatus`, data, true);
  }
  updateSolicitudAdelantoManager(data: any): Observable<any> {
    return this._baseService.put(`/adelanto-sueldo/UpdateAdvanceSalaryStatusManager`, data, true);
  }

}
