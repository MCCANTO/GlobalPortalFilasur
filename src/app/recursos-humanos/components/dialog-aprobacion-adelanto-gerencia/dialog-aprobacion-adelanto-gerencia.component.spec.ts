import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobacionAdelantoGerenciaComponent } from './dialog-aprobacion-adelanto-gerencia.component';

describe('DialogAprobacionAdelantoGerenciaComponent', () => {
  let component: DialogAprobacionAdelantoGerenciaComponent;
  let fixture: ComponentFixture<DialogAprobacionAdelantoGerenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAprobacionAdelantoGerenciaComponent]
    });
    fixture = TestBed.createComponent(DialogAprobacionAdelantoGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
