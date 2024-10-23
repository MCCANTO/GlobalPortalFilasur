import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudPrestamoSustentoComponent } from './dialog-solicitud-prestamo-sustento.component';

describe('DialogSolicitudPrestamoSustentoComponent', () => {
  let component: DialogSolicitudPrestamoSustentoComponent;
  let fixture: ComponentFixture<DialogSolicitudPrestamoSustentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudPrestamoSustentoComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudPrestamoSustentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
