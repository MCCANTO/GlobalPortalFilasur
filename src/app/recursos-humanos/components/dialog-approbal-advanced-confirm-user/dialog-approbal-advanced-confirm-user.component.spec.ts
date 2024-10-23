import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApprobalAdvancedConfirmUserComponent } from './dialog-approbal-advanced-confirm-user.component';

describe('DialogApprobalAdvancedConfirmUserComponent', () => {
  let component: DialogApprobalAdvancedConfirmUserComponent;
  let fixture: ComponentFixture<DialogApprobalAdvancedConfirmUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogApprobalAdvancedConfirmUserComponent]
    });
    fixture = TestBed.createComponent(DialogApprobalAdvancedConfirmUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
