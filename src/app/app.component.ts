import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { JwtTokenService } from './auth/services/jwt-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Material-Side-Navbar-In-Angular';

  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  @ViewChild('snav') sideNav!: MatSidenav;
  sideNavDefaultOpened = true;
  showFullMenu = true;
  isExpanded = true;
  closedWidth = 70;
  openedWidth = 250;
  isMobile!: boolean;
  sideNavMode: 'side' | 'over' = 'side';
  hasBackdrop: boolean = false;
  toolBarHeight = 64;
  isDarkTheme: boolean = false;
  isLoginRoute: boolean = false;
  isNotFoundRoute: boolean = true;

  constructor(
    private router: Router,
    private _jwtTokenService: JwtTokenService
  ) {

  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = this.router.url === '/auth-login' ||
                            this.router.url === '/' ||
                            this.router.url === '/auth-login/solicitar-acceso' ||
                            this.router.url === '/auth-login/cambiar-pass';
        this.isNotFoundRoute = this.router.url === '/404';

        if (!this._jwtTokenService.isLogin() && !this.isLoginRoute) {
          this.router.navigate(['/auth-login']);
        }
      }
    });

    // Escuchar cambios en el tamaño de la pantalla
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  closeSidebar() {
    if (this.isMobile) { // Solo cerrar si estamos en un dispositivo móvil
      this.sideNav.close();
    }
  }
  ngOnDestroy(): void {
    // this.mediaWatcher.unsubscribe();
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  onToolbarMenuToggle() {
    if (this.isMobile) {
      this.sideNav.toggle();
    } else {

      // REVISAR BIEN EL CODIGO ALGO ESTA FALLADO
      // EN PANTALLA  > 1020PX SUPERPONE EL MENU-CLOSED
       if (!this.isExpanded) {
         this.showFullMenu = true;

         // Asegurar que el sidenav esté completamente abierto antes de expandir
         setTimeout(() => {
           this.isExpanded = true;
         }, 200); // Un pequeño retraso para suavizar la animación
       } else {
        // console.log("no expande")
        //  this.isExpanded = false;

        //  // Retrasar la ocultación del menú completo hasta que la animación de colapso esté completa
        //  setTimeout(() => {
        //    this.showFullMenu = false;
        //  }, 200);
       }
    }
  }

  checkScreenSize() {

    this.isMobile = window.innerWidth <= 1020;

    if (this.isMobile) {
      this.sideNavMode = 'over'; // Superponer menú sobre el contenido
      this.sideNavDefaultOpened = false; // Cerrado por defecto en pantallas pequeñas
      //this.showFullMenu = false; // No mostrar el menú colapsado
      this.hasBackdrop = true; // Asegurar que tenga un backdrop en dispositivos móviles
    } else {
      this.sideNavMode = 'side'; // Menú lateral que empuja el contenido
      this.sideNavDefaultOpened = true; // Abierto por defecto en pantallas grandes
      //this.showFullMenu = true; // Mostrar el menú colapsado
      this.hasBackdrop = false; // Asegurar que tenga un backdrop en dispositivos móviles
    }
  }
}
