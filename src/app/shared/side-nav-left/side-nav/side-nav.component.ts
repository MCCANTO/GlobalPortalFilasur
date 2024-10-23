import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Route } from '@angular/router';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  routes!: Route[];
  @Output() closeMenu = new EventEmitter<void>();
  constructor(
    private menuService: MenuService,
    public _jwtTokenService: JwtTokenService
    ) {
    }

    onMenuClick() {
      this.closeMenu.emit();
    }

  async ngOnInit() {
    if (this._jwtTokenService.isLogin() != "") {
      const userRoles = this._jwtTokenService.getRol();       
      const rolesArray = userRoles.split(', ');
      this.routes = this.menuService.getRoutesForRole(rolesArray);
    }
  }

  ngOnDestroy() {
    this.routes = [];
  }
}
