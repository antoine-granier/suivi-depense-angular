import { AbstractControl, ValidationErrors } from "@angular/forms";

export function matchPassword(control: AbstractControl): ValidationErrors | null {

  const password = control.get("password")?.value;
  const confirm = control.get("confirmPassword")?.value;

  if(!password || !confirm) return null;

  if (password != confirm) { return { 'noMatch': true } }

  return null

}