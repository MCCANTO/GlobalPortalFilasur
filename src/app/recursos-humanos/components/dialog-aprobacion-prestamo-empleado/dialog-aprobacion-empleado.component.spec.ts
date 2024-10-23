import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobacionEmpleadoComponent } from './dialog-aprobacion-empleado.component';

describe('DialogAprobacionEmpleadoComponent', () => {
  let component: DialogAprobacionEmpleadoComponent;
  let fixture: ComponentFixture<DialogAprobacionEmpleadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAprobacionEmpleadoComponent]
    });
    fixture = TestBed.createComponent(DialogAprobacionEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
