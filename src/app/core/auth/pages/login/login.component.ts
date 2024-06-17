import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router'; // Import Router from Angular
import Swal from 'sweetalert2'; // Import the Swal class
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, CommonModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.initForm();
  }

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.signin(username, password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          Swal.fire({
            title: 'Bienvenido',
            text: 'Inicio de sesión exitoso',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    }
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
