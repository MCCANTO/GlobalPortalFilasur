import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAdelantoRemuneracionJefaturaComponent } from './lista-adelanto-remuneracion-jefatura.component';

describe('ListaAdelantoRemuneracionJefaturaComponent', () => {
  let component: ListaAdelantoRemuneracionJefaturaComponent;
  let fixture: ComponentFixture<ListaAdelantoRemuneracionJefaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaAdelantoRemuneracionJefaturaComponent]
    });
    fixture = TestBed.createComponent(ListaAdelantoRemuneracionJefaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
