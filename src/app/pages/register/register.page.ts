/**
 * Página de registro de nuevos usuarios.
 * Incluye validaciones personalizadas para contraseñas y confirmación.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/auth.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { UsersAppService } from 'src/app/core/services/impl/usersApp.service';
import { matchPasswordsValidator, passwordValidator } from 'src/app/core/utils/validators';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  /** Formulario de registro */
  registerForm: FormGroup;

  /** Controla visibilidad del campo contraseña */
  passwordVisible = false;

  /** Controla visibilidad del campo confirmar contraseña */
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    private userAppSvc: UsersAppService,
    private translateService: TranslateService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: matchPasswordsValidator
    });
  }

  /**
   * Procesa el registro y crea el `UserApp` vinculado al usuario.
   */
  onSubmit() {
    if (this.registerForm.valid) {
      this.authSvc.signUp(this.registerForm.value).subscribe({
        next: (resp: User) => {
          const userData = {
            ...this.registerForm.value,
            userId: resp.id.toString()
          };

          this.userAppSvc.add(userData).subscribe({
            next: () => {
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || "/home";
              this.router.navigateByUrl(returnUrl);
            },
            error: err => {
              console.error('❌ Error creando UserApp:', err);
            }
          });
        },
        error: err => {
          console.error('❌ Error en registro:', err);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  /**
   * Redirige a la página de login.
   */
  onLogin() {
    this.registerForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/login'], {
      queryParams: { returnUrl },
      replaceUrl: true
    });
  }

  /** Alterna visibilidad de la contraseña */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /** Alterna visibilidad de la confirmación */
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  /** Getters del formulario */
  get name() { return this.registerForm.controls['name']; }
  get surname() { return this.registerForm.controls['surname']; }
  get email() { return this.registerForm.controls['email']; }
  get password() { return this.registerForm.controls['password']; }
  get confirmPassword() { return this.registerForm.controls['confirmPassword']; }
}
