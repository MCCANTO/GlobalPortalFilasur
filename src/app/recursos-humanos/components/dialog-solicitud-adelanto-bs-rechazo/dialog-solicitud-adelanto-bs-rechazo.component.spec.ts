import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudAdelantoBsRechazoComponent } from './dialog-solicitud-adelanto-bs-rechazo.component';

describe('DialogSolicitudAdelantoBsRechazoComponent', () => {
  let component: DialogSolicitudAdelantoBsRechazoComponent;
  let fixture: ComponentFixture<DialogSolicitudAdelantoBsRechazoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSolicitudAdelantoBsRechazoComponent]
    });
    fixture = TestBed.createComponent(DialogSolicitudAdelantoBsRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
