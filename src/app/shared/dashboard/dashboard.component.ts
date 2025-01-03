import { Component, OnInit } from '@angular/core';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';

interface Card {
  imgSrc: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  nombre: string;
  cards: Array<Card> = [];
  orders_count = 10;
  reviews_count = 150;
  clicks_count = 430;
  shares_count = 43;

  constructor(
    private jwtTokenService: JwtTokenService,
  ) {

    this.nombre = this.capitalizeNombre(this.jwtTokenService.getNombreUsuario())/*.toLocaleLowerCase()*/;

    //this.nombre = this.jwtTokenService.getNombreUsuario().toLocaleLowerCase();
    //console.log(this.jwtTokenService.getNombreUsuario().toLocaleLowerCase())
  }

  ngOnInit(): void {
    this.cards = [
      
    ];
  }

  // Función para capitalizar la primera letra de cada palabra
  capitalizeNombre(nombreCompleto: string): string {
    return nombreCompleto
      .toLowerCase() // Convierte todo a minúsculas
      .split(' ')    // Divide las palabras por los espacios
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)) // Capitaliza la primera letra de cada palabra
      .join(' ');    // Une las palabras de nuevo con espacios
  }
}