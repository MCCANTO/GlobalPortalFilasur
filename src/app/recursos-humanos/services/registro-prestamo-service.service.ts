import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { FileServiceService } from './file-service.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroPrestamoServiceService {

  constructor(private baseService:BaseService,
              private baseFile:FileServiceService
  ) { }

   RegistrarPrestamo(data: FormData): Observable<any>{
     return this.baseService.post(`/prestamo/SaveLoanRequest`,data,true)
   }
   

   UploadLoanFile(formData: FormData): Observable<any> {          
    return this.baseFile.__postUploadFile(`/prestamo/UploadLoanFile`, formData)
  }

  getFileUrl(empleado:string, id_prestamo:number, nombre:string): Observable<any> {
    return this.baseService.getAsText(`/prestamo/fileDownload/${empleado}/${id_prestamo}/${nombre}`);
  }


   getLoanReasons(): Observable<any> {
    return this.baseService.get(`/prestamo/GetReasonLoanRequest`);
  }

  GetLoanEmployee(empleado: string): Observable<any> {
    return this.baseService.get(`/prestamo/GetAllLoanEmployeeRequest/${empleado}`);
  }

  GetAllLoanApplication(usercode:string): Observable<any> {
    return this.baseService.get(`/prestamo/GetAllLoanRequest/${usercode}`);
  }

  GetLoanApplicationCreated(usercode:string): Observable<any> {
    return this.baseService.get(`/prestamo/GetAllLoanApplicationCreated/${usercode}`);
  }

  UpdateEmployeeState(data: any): Observable<any> {
    return this.baseService.put(`/prestamo/UpdateEmployeeConfirmationStatus`, data, true);
  }

  UpdateSupervisorState(data: any): Observable<any> {
    return this.baseService.put(`/prestamo/UpdateSupervisorApprovalStatus`, data, true);
  }

  GetApprovalEmployeeRequest(): Observable<any> {
    return this.baseService.get(`/prestamo/GetApprovalEmployeeRequest`);
  }

  UpdateManagerApprobalState(data: any): Observable<any> {
    return this.baseService.put(`/prestamo/UpdateManagerApprovalStatus`, data, true);
  }

  GetLoanLimitAmount(empleado: string): Observable<any> {
    return this.baseService.get(`/prestamo/GetLoanLimitAmountRequest/${empleado}`);
  }

  getLoanDetails(id_prestamo: number): Observable<any> {
    return this.baseService.get(`/prestamo/GetLoanDetailsRequest/${id_prestamo}`);
  }

  UpdateLoanRequestState(data: any): Observable<any> {
    return this.baseService.put(`/prestamo/UpdateLoanRequestStatus`, data, true);
  }

  UpdateLoanRequestStateManager(data: any): Observable<any> {
    return this.baseService.put(`/prestamo/UpdateLoanRequestStatusManager`, data, true);
  }

  GetRequestStateValidation(empleado: string): Observable<any> {
    return this.baseService.get(`/prestamo/GetRequestStatus/${empleado}`);
  }

  GetRequestStateValidationAllowed(empleado: string): Observable<any> {
    return this.baseService.get(`/prestamo/GetRequestAllowedStatus/${empleado}`);
  }

  GetRequestAsyncAll(): Observable<any> {
    return this.baseService.get(`/prestamo/GetRequestAsyncAll`);
  }
}
