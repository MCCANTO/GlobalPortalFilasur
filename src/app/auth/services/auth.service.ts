import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtTokenService } from './jwt-token.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_BASE =  "";

  constructor(
    private http: HttpClient,
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) { 
     this.URL_BASE = environment.apiUrl + "/api-gateway/security/api"
     //this.URL_BASE = environment.apiUrl + "/security/api"
  }

  login(usuario: string, clave: string) {

    const body = {
      "username" : usuario,
      "password" : clave,
    }
    
    return this.http.post(`${ this.URL_BASE }/token`, body)
  }

  validate(usuario: string) {

    const body = {
      usuario
    }

    return this.http.post(`${ this.URL_BASE }/login`, body)
  }

  logout() {
    this.jwtTokenService.removeToken();
    this.router.navigate(['/page-not-found'])
  }

}
