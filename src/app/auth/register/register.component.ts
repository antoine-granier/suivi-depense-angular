import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchPassword } from '../../../app/validators/matchPassword';
import { AuthService } from '../../../app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'div.app-register.flex.align-items-center.h-screen.w-full',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {validators: matchPassword});
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      const lastId = await firstValueFrom(this.authService.getLastUserId())
      this.authService.register({
        id: lastId + 1,
        email: this.signUpForm.get("email")!.value,
        name: this.signUpForm.get("name")!.value,
        password: this.signUpForm.get("password")!.value
      }).subscribe({
        next: user => {
          this.router.navigate(["login"])
        },
        error: err => {
          console.log("Error");
        }
      })
    }
  }
}
