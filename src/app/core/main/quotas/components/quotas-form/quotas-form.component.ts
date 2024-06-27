import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { IUser } from '../../../users/interfaces/user.interface';
import { UserServices } from '../../../users/users.service';
import { QuotasService } from '../../quotas.service';

@Component({
  selector: 'app-quotas-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatRadioModule, 
    CommonModule, 
    MatAutocompleteModule
  ],
  templateUrl: './quotas-form.component.html',
  styles: ``,
})
export class QuotasFormComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private quotaService = inject(QuotasService);
  private userService = inject(UserServices);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);
  quotaForm!: FormGroup;
  isEditMode: boolean = false;
  users: IUser[] = [];
  filteredOptionsForEmployee?: Observable<IUser[]>;
  searchInputForEmployee = new FormControl<string | IUser>('');

  constructor() {}

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();
    this.loadUsers();

    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrievequota(id);
      });
    }

    this.filteredOptionsForEmployee = this.searchInputForEmployee.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map((value) => (typeof value === 'string' ? this.filterForUser(value) : this.filterForUser(value?.dni || '')))
    );
  }

  initForm(): void {
    this.quotaForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amout: ['', Validators.required],
      comission: ['', Validators.required],
      employeeId: ['', Validators.required],
    });

    this.quotaForm.addControl('searchInputForEmployee', this.searchInputForEmployee);
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      if (this.isEditMode && this.quotaForm.value.employeeId) {
        const user = this.users.find((user) => user.employee.id === this.quotaForm.value.employeeId);
        if (user) {
          this.searchInputForEmployee.setValue(user);
        }
      }
    });
  }

  displayFnForEmployee(user: IUser): string {
    return user ? `${user.dni} - ${user.firstName} - ${user.lastName}` : '';
  }

  private filterForUser(value: string): IUser[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) => 
      user.dni.toLowerCase().includes(filterValue) ||
      user.firstName.toLowerCase().includes(filterValue) ||
      user.lastName.toLowerCase().includes(filterValue)
    );
  }

  onUserSelected(event: any): void {
    const user = event.option.value as IUser;
    this.quotaForm.patchValue({ employeeId: user.employee.id });
  }

  private retrievequota(id: number): void {
    this.quotaService.getQuotaById(id).subscribe({
      next: (quota) => {
        const formattedQuota = {
          ...quota,
          startDate: new Date(quota.startDate).toISOString().substring(0, 10),
          endDate: new Date(quota.endDate).toISOString().substring(0, 10),
        };
        this.quotaForm.patchValue(formattedQuota);
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener la cuota',
          icon: 'error',
        });
        this.router.navigate(['/dashboard/quotas']);
      },
    });
  }

  private transformPayload(formValue: any): any {
    return {
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      amout: parseFloat(formValue.amout),
      comission: formValue.comission,
      achieved: "Pendiente",
      employeeId: parseInt(formValue.employeeId),
    };
  }

  onUpdate(): void {
    if (this.quotaForm.invalid) return;

    const id = this.activeRoute.snapshot.params['id'];
    const quota = this.transformPayload(this.quotaForm.value);
    this.quotaService.updateQuota(id, quota).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/quotas']);
        Swal.fire({
          title: 'Cuota actualizada',
          text: 'Cuota actualizada correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error updating quota:', err);
      },
    });
  }

  onCreate(): void {
    if (this.quotaForm.invalid) return;

    const quota = this.transformPayload(this.quotaForm.value);
    this.quotaService.addQuota(quota).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/quotas']);
        Swal.fire({
          title: 'Cuota creada',
          text: 'Cuota creada correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error creating quota:', err);
      },
    });
  }
}
