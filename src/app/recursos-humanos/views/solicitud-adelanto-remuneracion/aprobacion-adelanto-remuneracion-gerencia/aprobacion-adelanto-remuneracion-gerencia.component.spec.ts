import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionAdelantoRemuneracionGerenciaComponent } from './aprobacion-adelanto-remuneracion-gerencia.component';

describe('AprobacionAdelantoRemuneracionGerenciaComponent', () => {
  let component: AprobacionAdelantoRemuneracionGerenciaComponent;
  let fixture: ComponentFixture<AprobacionAdelantoRemuneracionGerenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprobacionAdelantoRemuneracionGerenciaComponent]
    });
    fixture = TestBed.createComponent(AprobacionAdelantoRemuneracionGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
