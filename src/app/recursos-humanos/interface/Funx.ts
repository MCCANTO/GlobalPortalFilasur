import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function montoMaximoValidator(montoLimite: number): ValidatorFn {

  //console.log("Validar en vivo: " + montoLimite)
  return (control: AbstractControl): { [key: string]: any } | null => {
    const excedido = control.value > montoLimite;
    return excedido ? { 'montoExcedido': { value: control.value } } : null;
  };

}

export function montoExcedidoGratificacion(salario: number,creditAmountControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value > salario) {
      return { 'montoExcedidoSalario': { value: control.value } };
    }
    if (control.value > creditAmountControl.value) {
      return { 'montoExcedidoCreditAmount': { value: control.value } };
    }
    return null;
  };
}

export function sumaDescuentosValidator(salario: number, creditAmountControl: AbstractControl): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const valorDescuentoJulio = group.get('valor_descuento_julio')?.value || 0;
    const valorDescuentoDiciembre = group.get('valor_descuento_diciembre')?.value || 0;
    const sumaDescuentos = valorDescuentoJulio + valorDescuentoDiciembre;

    if (sumaDescuentos > salario) {
      return { 'sumaDescuentosExcedeSalario': true };
    }
    if (sumaDescuentos > creditAmountControl.value) {
      return { 'sumaDescuentosExcedeCreditAmount': true };
    }
    return null;
  };
}