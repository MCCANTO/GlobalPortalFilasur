import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-pass',
  templateUrl: './cambiar-pass.component.html',
  styleUrls: ['./cambiar-pass.component.css']
})
export class CambiarPassComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      // Lógica para cambiar la contraseña
      const currentPassword = this.changePasswordForm.value.currentPassword;
      const newPassword = this.changePasswordForm.value.newPassword;

      // Aquí iría la llamada al servicio para actualizar la contraseña
      console.log('Contraseña cambiada correctamente:', { currentPassword, newPassword });
    }
  }
}
