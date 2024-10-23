import { Injectable } from '@angular/core';
import { childRoutes } from 'src/app/child-routes';
import { Route } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private routes = childRoutes;

  constructor() {}

  getRoutesForRole(roles: string[]): Route[] {
    const copiedRoutes = JSON.parse(JSON.stringify(this.routes));
    return copiedRoutes.filter((route:any) => this.isRouteVisibleForRole(route, roles));
  }

  private isRouteVisibleForRole(route: Route, roles: string[]): boolean {
    if (route.data && route.data['roles']) {
      const hasAccess = roles.some(role => route.data!['roles'].includes(role));
      if (!hasAccess) {
        return false;
      }
    }
    if (route.children) {
      route.children = route.children.filter(child => this.isRouteVisibleForRole(child, roles));
      return route.children.length > 0;
    }
    return true;
  }
}
