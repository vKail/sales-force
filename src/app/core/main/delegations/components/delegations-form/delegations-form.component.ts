import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DelegationsService } from '../../delegations.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { IUser } from '../../../users/interfaces/user.interface';
import { IClient } from '../../../clients/interfaces/client.interface';
import { ClientService } from '../../../clients/clients.service';
import { UserServices } from '../../../users/users.service';

@Component({
  selector: 'app-delegations-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './delegations-form.component.html',
  styles: ``,
})
export class DelegationsFormComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private delegationService = inject(DelegationsService);
  private userService = inject(UserServices);
  private clientService = inject(ClientService);
  private clients: IClient[] = [];
  private users: IUser[] = [];
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);
  delegationsForm!: FormGroup;
  isEditMode: boolean = false;
  filteredOptionsForEmployee?: Observable<IUser[]>;
  filteredOptionsForCustomer?: Observable<IClient[]>;
  searchInputForEmployee = new FormControl<string | IUser>('');
  searchInputForConsumer = new FormControl<string | IClient>('');

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();
    this.loadUsers();
    this.loadClients();

    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrieveDelegation(id);
      });
    }

    this.filteredOptionsForEmployee =
      this.searchInputForEmployee.valueChanges.pipe(
        debounceTime(300),
        startWith(''),
        map((value) =>
          typeof value === 'string'
            ? this.filterForUser(value)
            : this.filterForUser(value?.dni || '')
        )
      );

    this.filteredOptionsForCustomer =
      this.searchInputForConsumer.valueChanges.pipe(
        debounceTime(300),
        startWith(''),
        map((value) =>
          typeof value === 'string'
            ? this.filterForClient(value)
            : this.filterForClient(value?.dni || '')
        )
      );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      if (this.isEditMode && this.delegationsForm.value.employeeId) {
        const user = this.users.find(
          (user) => user.employee.id === this.delegationsForm.value.employeeId
        );
        if (user) {
          this.searchInputForEmployee.setValue(user);
        }
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
      if (this.isEditMode && this.delegationsForm.value.consumerId) {
        const client = this.clients.find(
          (client) =>
            client.consumer.id === this.delegationsForm.value.consumerId
        );
        if (client) {
          this.searchInputForConsumer.setValue(client);
        }
      }
    });
  }

  displayFnForEmployee(user: IUser): string {
    return user ? `${user.dni} - ${user.firstName} - ${user.lastName} - ${user.location.name}` : '';
  }

  displayFnForConsumer(client: IClient): string {
    return client
      ? `${client.dni} - ${client.firstName} - ${client.lastName} - ${client.location.name}`
      : '';
  }

  initForm(): void {
    this.delegationsForm = this.formBuilder.group({
      consumerId: ['', Validators.required],
      employeeId: ['', Validators.required],
    });

    this.delegationsForm.addControl(
      'searchInputForConsumer',
      this.searchInputForConsumer
    );
    this.delegationsForm.addControl(
      'searchInputForEmployee',
      this.searchInputForEmployee
    );
  }

  private filterForUser(value: string): IUser[] {
    return this.users?.filter((user) => user.dni.includes(value));
  }

  private filterForClient(value: string): IClient[] {
    return this.clients?.filter((client) => client.dni.includes(value));
  }

  onUserSelected(event: any): void {
    const user = event.option.value as IUser;
    this.delegationsForm.patchValue({ employeeId: user.employee.id });
  }

  onClientSelected(event: any): void {
    const client = event.option.value as IClient;
    this.delegationsForm.patchValue({ consumerId: client.consumer.id });
  }

  private retrieveDelegation(id: number): void {
    this.delegationService.getDelegationById(id).subscribe({
      next: (delegation) => {
        this.delegationsForm.patchValue(delegation);
        this.loadUsers();
        this.loadClients();
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener la delegación',
          icon: 'error',
        });
        this.router.navigate(['/dashboard/delegations']);
      },
    });
  }

  onUpdate(): void {
    if (this.delegationsForm.invalid) return;

    const id = this.activeRoute.snapshot.params['id'];
    const delegation = this.delegationsForm.value;
    this.delegationService.updateDelegation(id, delegation).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/delegations']);
        Swal.fire({
          title: 'Delegación actualizada',
          text: 'Delegación actualizada correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error updating delegation:', err);
      },
    });
  }

  onCreate(): void {
    if (this.delegationsForm.invalid) return;

    const delegation = this.delegationsForm.value;
    this.delegationService.addDelegation(delegation).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/delegations']);
        Swal.fire({
          title: 'Delegación creada',
          text: 'Delegación creada correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error creating delegation:', err);
      },
    });
  }
}
