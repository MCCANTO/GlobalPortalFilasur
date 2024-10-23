import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-dialog-solicitud-prestamo-sustento',
  template: `
    <h1 mat-dialog-title>Vista Previa del Documento</h1>
    <div mat-dialog-content>
      <iframe [src]="safeUrl" width="100%" height="400px"></iframe>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Cerrar</button>
    </div>
  `
  /*/'./dialog-solicitud-prestamo-sustento.component.html',*/
  //styleUrls: ['./dialog-solicitud-prestamo-sustento.component.css']
})
export class DialogSolicitudPrestamoSustentoComponent {
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private sanitizer: DomSanitizer
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
  }
}
