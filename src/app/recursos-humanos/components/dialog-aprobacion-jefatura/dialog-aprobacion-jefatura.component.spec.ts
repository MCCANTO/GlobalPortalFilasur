import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobacionJefaturaComponent } from './dialog-aprobacion-jefatura.component';

describe('DialogAprobacionJefaturaComponent', () => {
  let component: DialogAprobacionJefaturaComponent;
  let fixture: ComponentFixture<DialogAprobacionJefaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAprobacionJefaturaComponent]
    });
    fixture = TestBed.createComponent(DialogAprobacionJefaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
