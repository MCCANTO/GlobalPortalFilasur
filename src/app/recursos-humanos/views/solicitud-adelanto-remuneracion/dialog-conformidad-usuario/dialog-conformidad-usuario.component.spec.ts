import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConformidadUsuarioComponent } from './dialog-conformidad-usuario.component';

describe('DialogConformidadUsuarioComponent', () => {
  let component: DialogConformidadUsuarioComponent;
  let fixture: ComponentFixture<DialogConformidadUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogConformidadUsuarioComponent]
    });
    fixture = TestBed.createComponent(DialogConformidadUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
