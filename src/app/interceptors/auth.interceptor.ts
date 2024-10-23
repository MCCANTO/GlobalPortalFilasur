import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../auth/services/jwt-token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private jwtTokenService: JwtTokenService
  ) { }

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = this.jwtTokenService.getToken();

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + idToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
