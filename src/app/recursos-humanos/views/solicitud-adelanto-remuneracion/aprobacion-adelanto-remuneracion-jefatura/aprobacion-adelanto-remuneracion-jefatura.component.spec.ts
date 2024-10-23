import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionAdelantoRemuneracionJefaturaComponent } from './aprobacion-adelanto-remuneracion-jefatura.component';

describe('AprobacionAdelantoRemuneracionJefaturaComponent', () => {
  let component: AprobacionAdelantoRemuneracionJefaturaComponent;
  let fixture: ComponentFixture<AprobacionAdelantoRemuneracionJefaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprobacionAdelantoRemuneracionJefaturaComponent]
    });
    fixture = TestBed.createComponent(AprobacionAdelantoRemuneracionJefaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
