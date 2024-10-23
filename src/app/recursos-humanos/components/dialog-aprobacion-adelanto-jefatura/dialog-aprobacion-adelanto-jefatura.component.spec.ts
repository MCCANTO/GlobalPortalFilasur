import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobacionAdelantoJefaturaComponent } from './dialog-aprobacion-adelanto-jefatura.component';

describe('DialogAprobacionAdelantoJefaturaComponent', () => {
  let component: DialogAprobacionAdelantoJefaturaComponent;
  let fixture: ComponentFixture<DialogAprobacionAdelantoJefaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAprobacionAdelantoJefaturaComponent]
    });
    fixture = TestBed.createComponent(DialogAprobacionAdelantoJefaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
