import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { DelegationsService } from '../../delegations.service';
import { ClientService } from '../../../clients/clients.service';
import { UserServices } from '../../../users/users.service';
import { IClient } from '../../../clients/interfaces/client.interface';
import { IUser } from '../../../users/interfaces/user.interface';
import { IDelegationsPost, IDelegations } from '../../interfaces/delegations.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delegations-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delegations-form.component.html',
  styles: ``
})
export class DelegationsFormComponent implements OnInit {
  delegationForm!: FormGroup;
  clients: IClient[] = [];
  employees: IUser[] = [];
  filteredClients: IClient[] = [];
  filteredEmployees: IUser[] = [];
  selectedClientId: number | null = null;
  selectedEmployeeId: number | null = null;
  delegation: IDelegations | null = null;
  isEditMode: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationsService,
    private clientService: ClientService,
    private userService: UserServices,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.delegationForm = this.fb.group({
      clientDni: ['', Validators.required],
      employeeId: ['', Validators.required]
    });

    const delegationId = this.route.snapshot.params['id'];
    if (delegationId) {
      this.isEditMode = true;
      this.loadDelegationData(delegationId);
    } else {
      this.loadInitialData();
    }
  }

  loadDelegationData(id: number) {
    this.delegationService.getDelegationById(id).subscribe((delegation: IDelegations) => {
      this.delegation = delegation;
      this.selectedClientId = delegation.consumerId; // Adjust based on your interface structure
      this.selectedEmployeeId = delegation.employeeId; // Adjust based on your interface structure
      this.patchFormValues();
    });
  }

  patchFormValues() {
    if (this.delegation) {
      this.delegationForm.patchValue({
        clientDni: this.selectedClientId,
        employeeId: this.selectedEmployeeId,
      });
    }
  }

  loadInitialData() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });

    this.userService.getUsers().subscribe(employees => {
      this.employees = employees;
    });
  }

  searchClients(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    this.filteredClients = this.clients.filter(client => client.dni.includes(inputValue)); // Adjust based on your interface structure
  }

  searchEmployees(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    this.filteredEmployees = this.employees.filter(employee => employee.dni.includes(inputValue)); // Adjust based on your interface structure
  }

  selectClient(client: IClient) {
    this.selectedClientId = client.id; // Adjust based on your interface structure
    this.delegationForm.patchValue({ clientDni: client.dni }); // Adjust based on your interface structure
    this.filteredClients = [];
  }

  selectEmployee(employee: IUser) {
    this.selectedEmployeeId = employee.id; // Adjust based on your interface structure
    this.delegationForm.patchValue({ employeeId: employee.id.toString() });
    this.filteredEmployees = [];
  }

  onSave() {
    if (this.selectedClientId !== null && this.selectedEmployeeId !== null) {
      const delegationData: IDelegationsPost = {
        employeeId: Number(this.selectedEmployeeId), // Adjust based on your interface structure
        consumerId: Number(this.selectedClientId), // Adjust based on your interface structure
      };

      this.delegationService.addDelegation(delegationData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/delegations']);
          Swal.fire({
            title: 'Delegación creada con éxito',
            text: 'La delegación ha sido creada correctamente',
            icon: 'success',
          });
        },
        error: (err) => {
          console.error('Error creating delegation:', err);
        },
      });
    }
  }

  onUpdate() {
    if (this.delegationForm.invalid || this.selectedClientId === null || this.selectedEmployeeId === null) {
      console.error('Form is invalid or client/employee is not selected.');
      return;
    }

    if (!this.delegation) {
      console.error('No delegation data available for update.');
      return;
    }

    const idToUpdate = this.delegation.id;

    const delegationDataToUpdate: IDelegationsPost = {
      employeeId: Number(this.selectedEmployeeId), // Adjust based on your interface structure
      consumerId: Number(this.selectedClientId), // Adjust based on your interface structure
    };

    this.delegationService.updateDelegation(idToUpdate, delegationDataToUpdate).subscribe({
      next: () => {
        Swal.fire({
          title: 'Delegación actualizada',
          text: 'La delegación se actualizó correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error updating delegation:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la delegación',
          icon: 'error',
        });
      }
    });
  }
}
