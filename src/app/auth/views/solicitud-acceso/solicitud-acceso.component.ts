import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-acceso',
  templateUrl: './solicitud-acceso.component.html',
  styleUrls: ['./solicitud-acceso.component.css']
})
export class SolicitudAccesoComponent {
  accesoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.accesoForm = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.matchPasswords });
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.accesoForm.valid) {
      console.log('Formulario enviado', this.accesoForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  regresarLogin() {
    this.router.navigate(['/auth-login']);
  }
}
