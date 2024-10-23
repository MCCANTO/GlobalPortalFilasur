import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UsuarioService } from '../../services/usuario.service';
import { AlertServiceService } from 'src/app/services/utils/alert-service.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.valid && (control.dirty || control.touched) && form?.hasError('notMatched'));
  }
}

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit{
  public form!: FormGroup;
  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?.])[A-Za-z\d#$@!%&*?.]{8,16}$/;
  public matcher = new MyErrorStateMatcher();
  public hidePassword = {
    oldPassword: true,
    newPassword: true,
    confirmPassword: true
  };

  constructor(
    private fb: FormBuilder,
    private _userService: UsuarioService,
    private _alertService: AlertServiceService,
  ) {
    this.formInit();
  }

  ngOnInit(): void {}

  private formInit() {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmNewPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    }, { validator: this.checkingPasswords });
  }

  public submitForm() {
    console.log(this.form.getRawValue());

    this._userService.save(this.form.getRawValue()).subscribe(response => {
      this._alertService.snackBar("Se guardo correctamente", "Ok");
      this.form.reset();
    });

  }

  public checkingPasswords(formGroup: FormGroup) {
    const newPassword = formGroup.controls['newPassword'].value;
    const confirmNewPassword = formGroup.controls['confirmNewPassword'].value;

    return newPassword === confirmNewPassword ? null : { notMatched: true };
  }

  public checkValidations(control: AbstractControl, type: string): boolean {
    switch (type) {
      case 'special-character':
        return /[#$@!%&*?.,]/.test(control.value);
      case 'number':
        return /\d/.test(control.value);
      case 'lowercase':
        return /[a-z]/.test(control.value);
      case 'uppercase':
        return /[A-Z]/.test(control.value);
      case 'length':
        return control.value.length >= 8 && control.value.length <= 16;
      default:
        return false;
    }
  }
}
