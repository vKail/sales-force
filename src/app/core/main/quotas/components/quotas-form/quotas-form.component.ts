import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotasService } from '../../quotas.service';
import Swal from 'sweetalert2';
import { parse } from 'path';

@Component({
  selector: 'app-quotas-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatRadioModule, CommonModule],
  templateUrl: './quotas-form.component.html',
  styles: ``,
})
export class QuotasFormComponent {
  private activeRoute = inject(ActivatedRoute);
  private quotaService = inject(QuotasService);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);
  quotaForm!: FormGroup;
  isEditMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();

    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrievequota(id);
      });
    }
  }

  initForm(): void {
    this.quotaForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amout: ['', Validators.required],
      comission: ['', Validators.required],
      achieved: ['', [Validators.required, Validators.email]],
      employeeId: ['', Validators.required],
    });
  }

  private retrievequota(id: number): void {
    this.quotaService.getQuotaById(id).subscribe({
      next: (quota) => {
        // Convert birthDate to a format compatible with input[type="date"]
        const formattedquota = {
          ...quota,
          startDate: new Date(quota.startDate).toISOString().substring(0, 10),
          endDate: new Date(quota.endDate).toISOString().substring(0, 10),
        };
        this.quotaForm.patchValue(formattedquota);
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener el quotae',
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
      achieved: formValue.achieved,
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