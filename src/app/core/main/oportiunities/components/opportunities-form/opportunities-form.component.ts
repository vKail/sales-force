import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChancesServices } from '../../opportunities.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DelegationsService } from '../../../delegations/delegations.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opportunities-form',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './opportunities-form.component.html',
  styles:  ``,
})
export class OpportunitiesFormComponent implements OnInit{
  private activeRoute = inject(ActivatedRoute);
  private chanceService = inject(ChancesServices);
  private delegationService = inject(DelegationsService);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);

  chanceForm!: FormGroup;
  isEditMode: boolean = false;

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();
  
    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrieveChance(id);
      });
    }
  }
  

  initForm(): void {
    this.chanceForm = this.formBuilder.group({
      amount: [
        '',
        Validators.required,
      ],
      date: [
        '',
        Validators.required,
      ],
      delegationId: [
        '',
        Validators.required,
      ],
    });
  }

  private retrieveChance(id: number): void {
    this.chanceService.getChanceById(id).subscribe({
      next: (chance) => {
        // Asegurarte de que el valor de codigoTarifa se selecciona correctamente
        const chanceData = {
          ...chance,
          date: new Date(chance.date).toISOString().split('T')[0],
          
        };
        this.chanceForm.patchValue(chanceData);
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener la Oportunidad',
          icon: 'error',
        });
        this.router.navigate(['/dashboard/opportunities']);
      },
    });
  }
  onUpdate(): void {
    const id = this.activeRoute.snapshot.params['id'];
    const chance = this.chanceForm.value;
    // Aquí podrías asegurarte de enviar solo el id de la tarifa de impuestos
     // Convertir a string si es necesario
    console.log('chance:', chance); 
    this.chanceService.updateChance(id, chance).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/opportunities']);
        Swal.fire({
          title: 'Oportunidad actualizada',
          text: 'Oportunidad actualizada correctamente',
          icon: 'success',
        });
      },
    });
  }
  

  onCreate(): void {
    if (this.chanceForm.invalid) return;
    const chance = this.chanceForm.value;
    console.log('chance:', chance); 
    this.chanceService.addChance(chance).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/opportunities']);
        Swal.fire({
          title: 'Oportunidad creada',
          text: 'Oportunidad creada correctamente',
          icon: 'success',
        });
      },
    });
  }
}