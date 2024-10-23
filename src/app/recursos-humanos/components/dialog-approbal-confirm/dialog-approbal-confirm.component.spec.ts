import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApprobalConfirmComponent } from './dialog-approbal-confirm.component';

describe('DialogApprobalConfirmComponent', () => {
  let component: DialogApprobalConfirmComponent;
  let fixture: ComponentFixture<DialogApprobalConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogApprobalConfirmComponent]
    });
    fixture = TestBed.createComponent(DialogApprobalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
