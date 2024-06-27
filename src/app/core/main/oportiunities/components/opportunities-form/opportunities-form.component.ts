import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChancesServices } from '../../opportunities.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DelegationsService } from '../../../delegations/delegations.service';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { IDelegationGet } from '../../../delegations/interfaces/delegations.interface';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-opportunities-form',
  standalone: true,
  imports: [ ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatAutocompleteModule],
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

  searchInputForTask = new FormControl<string | IDelegationGet>('');

  filteredDelegations!: Observable<IDelegationGet[]>;
  delegations: IDelegationGet[] = [];

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();
  
    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrieveChance(id);
      });
    }

    this.loadDelegations();

    this.filteredDelegations = this.searchInputForTask.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : this.displayDelegation(value as IDelegationGet))),
      map(name => (name ? this._filter(name) : this.delegations.slice()))
    );
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

        // Set the selected delegation in the autocompleter
        const selectedDelegation = this.delegations.find(d => d.id === chance.delegationId);
        if (selectedDelegation) {
          this.searchInputForTask.setValue(selectedDelegation);
        }
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
  
  onDelegationSelected(event: any): void {
    const delegation = event.option.value as IDelegationGet;
    this.chanceForm.patchValue({ delegationId: delegation.id });
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

  loadDelegations(): void {
    this.delegationService.getDelegations().subscribe({
      next: (data) => {
        this.delegations = data;

        // If in edit mode, set the initial value for the delegation
        if (this.isEditMode && this.chanceForm.value.delegationId) {
          const delegation = this.delegations.find(d => d.id === this.chanceForm.value.delegationId);
          if (delegation) {
            this.searchInputForTask.setValue(delegation);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching delegations:', err);
      },
    });
  }

  displayDelegation(delegation: IDelegationGet): string {
    return delegation ? `${delegation.employee.person.dni} - ${delegation.employee.person.firstName} ${delegation.employee.person.lastName} / ${delegation.consumer.person.dni} - ${delegation.consumer.person.firstName} ${delegation.consumer.person.lastName}` : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.delegations.filter(delegation =>
      delegation.employee.person.dni.toLowerCase().includes(filterValue) ||
      delegation.employee.person.firstName.toLowerCase().includes(filterValue) ||
      delegation.employee.person.lastName.toLowerCase().includes(filterValue) ||
      delegation.consumer.person.dni.toLowerCase().includes(filterValue) ||
      delegation.consumer.person.firstName.toLowerCase().includes(filterValue) ||
      delegation.consumer.person.lastName.toLowerCase().includes(filterValue)
    );
  }
}
