import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../auth/services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private jwtTokenService: JwtTokenService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = this.jwtTokenService.getToken();

    if (token) {
      const expirado = this.jwtTokenService.isTokenExpired();

      if (expirado) {
        this.router.navigate(['/auth-login']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/auth-login']);
    return false;
  }

}