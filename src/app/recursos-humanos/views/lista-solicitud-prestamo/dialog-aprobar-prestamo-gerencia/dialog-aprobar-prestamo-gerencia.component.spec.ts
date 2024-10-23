import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobarPrestamoGerenciaComponent } from './dialog-aprobar-prestamo-gerencia.component';

describe('DialogAprobarPrestamoGerenciaComponent', () => {
  let component: DialogAprobarPrestamoGerenciaComponent;
  let fixture: ComponentFixture<DialogAprobarPrestamoGerenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAprobarPrestamoGerenciaComponent]
    });
    fixture = TestBed.createComponent(DialogAprobarPrestamoGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
