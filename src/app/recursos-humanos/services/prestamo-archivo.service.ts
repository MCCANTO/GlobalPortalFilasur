import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestamoArchivoService {

  constructor(private _baseService:BaseService) {  }

  getArchivosxPrestamo(usercode:string, id_prestamo:number): Observable<any> {
    return this._baseService.get(`/prestamo-archivo/GetAllLoanFileRequest/${usercode}/${id_prestamo}`);
  }

  saveArchivosxPrestamo(usercode: string, id_prestamo: number, files: File[]): Observable<any> {
    const formData: FormData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file, file.name);
    });

    return this._baseService.postFiles(`/prestamo-archivo/upload/${usercode}/${id_prestamo}`, formData);
  }

}
