import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { UserServices } from '../../users.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    CommonModule,
  ],
  templateUrl: './user-form.component.html',
  styles: [],
})
export class UserFormComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private clientService = inject(UserServices);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);
  clientForm!: FormGroup;
  isEditMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();

    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrieveClient(id);
      });
    }
  }

  initForm(): void {
    this.clientForm = this.formBuilder.group({
      dni: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      locationId: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', this.isEditMode ? [] : Validators.required], // Password is only required for creation
      role: ['', Validators.required],
    });
  }

  private retrieveClient(id: number): void {
    this.clientService.getUserById(id).subscribe({
      next: (user) => {
        // Convert birthDate to a format compatible with input[type="date"]
        const formattedUser = {
          ...user,
          birthDate: new Date(user.birthDate).toISOString().substring(0, 10),
          username: user.employee.username,
          role: user.employee.role
        };
        this.clientForm.patchValue(formattedUser);
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener el cliente',
          icon: 'error',
        });
        this.router.navigate(['/dashboard/clients']);
      },
    });
  }

  private transformPayload(formValue: any): any {
    return {
      dni: formValue.dni,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      gender: formValue.gender,
      email: formValue.email,
      address: formValue.address,
      phone: formValue.phone,
      birthDate: new Date(formValue.birthDate).toISOString(),
      locationId: parseInt(formValue.locationId, 10),
      employee: {
        username: formValue.username,
        password: formValue.password,
        role: formValue.role,
        isActive: true,
      },
    };
  }

  onUpdate(): void {
    if (this.clientForm.invalid) return;

    const id = this.activeRoute.snapshot.params['id'];
    const user = this.transformPayload(this.clientForm.value);
    delete user.employee.password; // Remove password if not changing it
    this.clientService.updateUser(id, user).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/clients']);
        Swal.fire({
          title: 'Cliente actualizado',
          text: 'Cliente actualizado correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error updating user:', err);
      },
    });
  }

  onCreate(): void {
    if (this.clientForm.invalid) return;

    const user = this.transformPayload(this.clientForm.value);
    this.clientService.addUser(user).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/clients']);
        Swal.fire({
          title: 'Cliente creado',
          text: 'Cliente creado correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error creating user:', err);
      },
    });
  }
}
