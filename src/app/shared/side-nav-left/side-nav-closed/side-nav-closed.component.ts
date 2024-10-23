import { Component, OnInit } from '@angular/core';
import { childRoutes } from 'src/app/child-routes';

@Component({
  selector: 'app-side-nav-closed',
  templateUrl: './side-nav-closed.component.html',
  styleUrls: ['./side-nav-closed.component.css']
})
export class SideNavClosedComponent implements OnInit{
  routes = childRoutes;
  constructor() { }

  ngOnInit(): void {
  }
}
