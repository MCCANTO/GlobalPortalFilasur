import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  show( message: string, 
        backgroundColor: string = 'black', 
        textColor: string = 'white', 
        position: MatSnackBarConfig['horizontalPosition'] = 'center', 
        duration: number = 3000) {
          
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, backgroundColor, textColor },
      duration,
      horizontalPosition: position,
      verticalPosition: 'bottom', // Puedes ajustar la posición vertical aquí
      panelClass: 'custom-snackbar'
    });
  }
}
