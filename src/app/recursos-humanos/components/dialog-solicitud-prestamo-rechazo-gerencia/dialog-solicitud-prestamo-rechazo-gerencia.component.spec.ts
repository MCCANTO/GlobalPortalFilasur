import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudPrestamoRechazoGerenciaComponent } from './dialog-solicitud-prestamo-rechazo-gerencia.component';

describe('DialogSolicitudPrestamoRechazoGerenciaComponent', () => {
  let component: DialogSolicitudPrestamoRechazoGerenciaComponent;
  let fixture: ComponentFixture<DialogSolicitudPrestamoRechazoGerenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudPrestamoRechazoGerenciaComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudPrestamoRechazoGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
