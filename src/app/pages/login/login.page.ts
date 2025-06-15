/**
 * Página de inicio de sesión de usuarios.
 * Contiene el formulario de login, validación y redirección al iniciar sesión.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  /** Formulario reactivo de login */
  loginForm: FormGroup;

  /** Controla la visibilidad del campo de contraseña */
  passwordVisible: boolean = false;

  /** Mensaje de error a mostrar si falla el login */
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /** Alterna la visibilidad del campo de contraseña */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Envía el formulario de login y redirige al usuario si es exitoso.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.authSvc.signIn(this.loginForm.value).subscribe({
        next: resp => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        },
        error: err => {
          if (err.status === 400 && err.error?.error?.message) {
            this.errorMessage = "Credential invalids";
          } else {
            this.errorMessage = "Invalid credentials";
          }
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  /**
   * Redirige a la página de registro.
   */
  onRegister() {
    this.loginForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/register'], { queryParams: { returnUrl }, replaceUrl: true });
  }

  /** Placeholder para la funcionalidad de "forgot password" */
  onForgotPassword() {}

  /** Getter del campo email */
  get email() {
    return this.loginForm.controls['email'];
  }

  /** Getter del campo password */
  get password() {
    return this.loginForm.controls['password'];
  }
}

