import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<void>();
  user: any;
  userProfile = {
    photoUrl: 'https://modernize-angular-main.netlify.app/assets/images/profile/user-1.jpg',
    name: 'Mathew Anderson',
    role: 'Designer',
    email: 'info@modernize.com'
  };

  constructor(
    private readonly router: Router,
    private _jwtTokenService: JwtTokenService,
    private _dialog: MatDialog
  ) {
    this.userProfile.name  = this._jwtTokenService.getNombreUsuario();
    this.userProfile.role  = this._jwtTokenService.getRol();
    this.userProfile.email = this._jwtTokenService.getEmail();
  }

  ngOnInit() {
    
    if (this._jwtTokenService.isLogin() != "") {
      this.user = {
        name: this._jwtTokenService.getDecodeToken().nombre,
        photoUrl: 'https://modernize-angular-main.netlify.app/assets/images/profile/user-1.jpg'
      };
    }
    
  }

  toggleSidebar(): void {
    this.sideNavToggled.emit();
  }

  logout(): void {
    // Cerrar todos los diálogos abiertos antes de cerrar sesión
    this._dialog.closeAll();
    // Lógica para cerrar sesión
    this._jwtTokenService.removeToken();
    this.router.navigate(['/auth-login']);
  }

  goToChangePassword() {
    // Lógica para navegar a la bandeja de entrada del usuario
    console.log("Cambiar contraseña y llamar al componente ")
    this.router.navigate(['/gestion-usuario/change-password']);
  }

  goToProfile(): void {
    // Lógica para ir a la página de perfil
    console.log('Ir al perfil');
  }
}
