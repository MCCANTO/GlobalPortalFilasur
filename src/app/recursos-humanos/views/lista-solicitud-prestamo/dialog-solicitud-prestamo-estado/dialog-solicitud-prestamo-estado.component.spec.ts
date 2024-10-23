import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudPrestamoEstadoComponent } from './dialog-solicitud-prestamo-estado.component';

describe('DialogSolicitudPrestamoEstadoComponent', () => {
  let component: DialogSolicitudPrestamoEstadoComponent;
  let fixture: ComponentFixture<DialogSolicitudPrestamoEstadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudPrestamoEstadoComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudPrestamoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
