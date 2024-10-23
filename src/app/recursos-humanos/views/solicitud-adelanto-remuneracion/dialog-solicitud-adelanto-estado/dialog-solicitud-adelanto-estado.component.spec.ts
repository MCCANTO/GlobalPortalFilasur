import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudAdelantoEstadoComponent } from './dialog-solicitud-adelanto-estado.component';

describe('DialogSolicitudAdelantoEstadoComponent', () => {
  let component: DialogSolicitudAdelantoEstadoComponent;
  let fixture: ComponentFixture<DialogSolicitudAdelantoEstadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudAdelantoEstadoComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudAdelantoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
