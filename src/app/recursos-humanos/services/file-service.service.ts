import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface IResPostPut {
  status: number;
  data: any | null;
  erro: any | null;
}

@Injectable({
  providedIn: 'root'
})


export class FileServiceService {

  private REST_ENDPOINT = 'http://localhost:5080/api';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  __postUploadFile(urlapi: string, formData: FormData): Observable<IResPostPut> {
  
    return this.http.post<any>(`${this.REST_ENDPOINT}${urlapi}`, formData, {
      observe: 'events',
      reportProgress: true,
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              console.log(`Upload Progress: ${Math.round((100 * event.loaded) / event.total)}%`);
            }
            return { status: 0, data: null, erro: null }; // Return a dummy object to satisfy type requirements
          case HttpEventType.Response:
            return { status: event.status, data: event.body, erro: null };
          default:
            return { status: 0, data: null, erro: null }; // Return a dummy object to satisfy type requirements
        }
      }),
      catchError((error) => {
        return throwError({ status: 0, data: null, erro: error });
      })
    );
  }


}
