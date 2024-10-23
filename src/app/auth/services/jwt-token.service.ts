import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';
import { UserData, UserDataCustomize } from '../interfaces/user-data';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {
  private token_name: string = 'gp.scp.current_user';
  private decodedToken!: { [key: string]: string };

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  isLogin() {
    return this.localStorageService.get(this.token_name) == null ? "" : this.localStorageService.get(this.token_name);
  }

  getToken() {
    return this.localStorageService.get(this.token_name);
  }

  setToken(token: string) {
    if (token) {
      this.localStorageService.set(this.token_name, token);
    }
  }

  removeToken() {
    this.localStorageService.remove(this.token_name);
  }

  decodeToken() {
    const jwtToken = this.localStorageService.get(this.token_name);
    if (jwtToken) {
      this.decodedToken = jwt_decode(jwtToken);
    }
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = Number(this.getExpiryTime());
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }

  getDecodeToken(): UserDataCustomize {
    this.decodeToken();
    const Data: UserDataCustomize = {
      certserialnumber: this.decodedToken['certserialnumber'],
      username: this.decodedToken['username'],
      usercode: this.decodedToken['usercode'],
      nombre: this.decodedToken['nombre'],
      rol: this.decodedToken['rol'],
      email: this.decodedToken['email'],
      dni: this.decodedToken['dni'],
      readonly: this.decodedToken['readonly'],
      hash: this.decodedToken['hash'],
      api: this.decodedToken['api'],
      nbf: parseInt(this.decodedToken['nbf']),
      exp: parseInt(this.decodedToken['exp']),
      iat: parseInt(this.decodedToken['iat']),
      iss: this.decodedToken['iss'],
      aud: this.decodedToken['aud']
    };
    return Data;
  }

  getUserId() {
    const data = this.getDecodeToken();
    return data['certserialnumber'];
  }

  getUserName() {
    const data = this.getDecodeToken();
    return data['username'];
 }

  getUserCode() {
     const data = this.getDecodeToken();
     return data['usercode'];
  }

  getNombreUsuario() {
    const data = this.getDecodeToken();
    return data['nombre'];
  }
  getRol() {
    const data = this.getDecodeToken();
    return data['rol'];
  }
  getEmail() {
    const data = this.getDecodeToken();
    return data['email'];
  }
  getDni() {
    const data = this.getDecodeToken();
    return data['dni'];
  }
}
