import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _baseService:BaseService) { }

  getAll(): Observable<any> {
    return this._baseService.get(`/setting/getActivities`);
  }

  save(data: any): Observable<any> {
    return this._baseService.post(`/setting/changepass`, data, true);
  }

  update(data: any): Observable<any> {
    return this._baseService.put(`/setting/updateActivity`, data, true);
  }

  delete(id: number): Observable<any> {
    return this._baseService.delete(`/setting/deleteActivity/${id}`, true);
  }

}
