import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtTokenService } from '../../services/jwt-token.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private jwtTokenService: JwtTokenService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Procesar la autenticación aquí
      this.spinner.show();
      
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe( (resp: any) => {

        setTimeout(() => {
          this.spinner.hide();

          if( resp.token ){

            this.jwtTokenService.removeToken();
  
            this.jwtTokenService.setToken(resp.token);
  
            this.router.navigate(['/dashboard']);
  
          } else {
  
            // this.messageService.add({severity:'error', summary: 'Error de Autenticación', detail: 'Usuario y/o contraseña incorrectos.'});
  
          }
          
        }, 1000);
      });
    }
  }
}
