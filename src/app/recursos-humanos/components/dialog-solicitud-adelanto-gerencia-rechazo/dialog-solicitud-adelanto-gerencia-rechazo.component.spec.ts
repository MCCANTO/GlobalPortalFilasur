import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudAdelantoGerenciaRechazoComponent } from './dialog-solicitud-adelanto-gerencia-rechazo.component';

describe('DialogSolicitudAdelantoGerenciaRechazoComponent', () => {
  let component: DialogSolicitudAdelantoGerenciaRechazoComponent;
  let fixture: ComponentFixture<DialogSolicitudAdelantoGerenciaRechazoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudAdelantoGerenciaRechazoComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudAdelantoGerenciaRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
