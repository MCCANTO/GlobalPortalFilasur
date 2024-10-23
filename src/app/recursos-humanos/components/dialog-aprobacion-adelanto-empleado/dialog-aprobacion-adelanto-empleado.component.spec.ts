import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobacionAdelantoEmpleadoComponent } from './dialog-aprobacion-adelanto-empleado.component';

describe('DialogAprobacionAdelantoEmpleadoComponent', () => {
  let component: DialogAprobacionAdelantoEmpleadoComponent;
  let fixture: ComponentFixture<DialogAprobacionAdelantoEmpleadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAprobacionAdelantoEmpleadoComponent]
    });
    fixture = TestBed.createComponent(DialogAprobacionAdelantoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
