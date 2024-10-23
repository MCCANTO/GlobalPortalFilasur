import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdelantoSueldoServiceService {

  constructor(private baseService:BaseService) { }

  getSolicitudesAdelantoSueldoAprobar(usercode:string): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAllAdvancedSalaryEv/${usercode}`);
  }

  GetAllAdvancedSalaryRequest(empleado: string): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAllAdvancedSalaryRequest/${empleado}`);
  }

  SaveAdvanceSalary(data: any): Observable<any>{
    return this.baseService.post(`/adelanto-salario/SaveSalaryRequest`,data,true)
  }

  GetLimitAdvanceAmount(empleado: string): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetLimitAdvanceRequest/${empleado}`);
  }

  getAdvancedReasonsRequest(): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAdvacendReasonRequest`);
  }

  GetLoanEmployeeAccount(empleado: string): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetSalaryAdvanceAccount/${empleado}`);
  }

  GetAdvancedSalaryRequestSupervisor(): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAdvacendRequestSupervisor`);
  }

  GetAdvancedSalaryRequestManager(): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAdvacendRequestManager`);
  }

  UpdateSupervisorState(data: any): Observable<any> {
    return this.baseService.put(`/adelanto-salario/UpdateAdvanceSalarySupervisorApprovalStatus`, data, true);
  }

  UpdateManagerApprobalState(data: any): Observable<any> {
    return this.baseService.put(`/adelanto-salario/UpdateAdvanceSalaryManagerApprovalStatus`, data, true);
  }

  UpdateEmployeeApprobalState(data: any): Observable<any> {
    return this.baseService.put(`/adelanto-salario/UpdateAdvanceSalaryEmployeeApprovalStatus`, data, true);
  }

  UpdateAdvancedRequestState(data: any): Observable<any> {
    return this.baseService.put(`/adelanto-salario/UpdateAdvanceSalaryStatus`, data, true);
  }

  UpdateAdvancedRequestStateManager(data: any): Observable<any> {
    return this.baseService.put(`/adelanto-salario/UpdateAdvanceSalaryStatusManager`, data, true);
  }

  GetRequestStateValidationAdvance(empleado: string): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAdvanceStatusRequest/${empleado}`);
  }

  getSolicitudesGeneralAdelantoSueldo(): Observable<any> {
    return this.baseService.get(`/adelanto-salario/GetAdvanceRequestAsyncAll`);
  }
}
