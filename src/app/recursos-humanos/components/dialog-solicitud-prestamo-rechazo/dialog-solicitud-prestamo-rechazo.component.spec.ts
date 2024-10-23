import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudPrestamoRechazoComponent } from './dialog-solicitud-prestamo-rechazo.component';

describe('DialogSolicitudPrestamoRechazoComponent', () => {
  let component: DialogSolicitudPrestamoRechazoComponent;
  let fixture: ComponentFixture<DialogSolicitudPrestamoRechazoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudPrestamoRechazoComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudPrestamoRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
