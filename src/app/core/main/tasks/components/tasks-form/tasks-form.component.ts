import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../tasks.service';
import { DelegationsService } from '../../../delegations/delegations.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IDelegationGet } from '../../../delegations/interfaces/delegations.interface';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-tasks-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatAutocompleteModule
  ],
  templateUrl: './tasks-form.component.html',
  styles: [],
})
export class TasksFormComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private taskService = inject(TasksService);
  private delegationsService = inject(DelegationsService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  tasksForm!: FormGroup;
  searchInputForTask = new FormControl<string | IDelegationGet>('');
  filteredDelegations!: Observable<IDelegationGet[]>;
  delegations: IDelegationGet[] = [];

  isEditMode: boolean = false;
  minDate: string = '';
  maxDate: string = '';
  minDateTime: string = '';
  maxDateTime: string = '';

  constructor() {}

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();
    this.setMinMaxDates();

    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrievetask(id);
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
    this.tasksForm = this.formBuilder.group({
      delegationId: ['', Validators.required],
      date: ['', Validators.required],
      estimatedTime: ['', Validators.required],
      content: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  private retrievetask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        const formattedtask = {
          ...task,
          date: new Date(task.date).toISOString().substring(0, 10),
          estimatedTime: new Date(task.estimatedTime).toISOString().substring(0, 10),
          content: task.comment.content,
        };
        this.tasksForm.patchValue(formattedtask);

        // Set the selected delegation in the autocompleter
        const selectedDelegation = this.delegations.find(d => d.id === task.delegationId);
        if (selectedDelegation) {
          this.searchInputForTask.setValue(selectedDelegation);
        }
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener la tarea',
          icon: 'error',
        });
        this.router.navigate(['/dashboard/tasks']);
      },
    });
  }

  onDelegationSelected(event: any): void {
    const delegation = event.option.value as IDelegationGet;
    this.tasksForm.patchValue({ delegationId: delegation.id });
  }

  transforData(formValue: any): ITask {
    const dateWithTime = new Date(formValue.date).toISOString();
    const estimatedTimeWithTime = new Date(formValue.estimatedTime).toISOString();
  
    return {
      date: dateWithTime,
      estimatedTime: estimatedTimeWithTime,
      type: formValue.type,
      delegationId: formValue.delegationId,
      comment: {
        content: formValue.content.toString(),
      },
    };
  }

  setMinMaxDates(): void {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 30);

    this.minDate = currentDate.toISOString().substring(0, 10);
    this.maxDate = futureDate.toISOString().substring(0, 10);
    this.minDateTime = this.formatDateTime(currentDate);
    this.maxDateTime = this.formatDateTime(futureDate);
  }

  formatDateTime(dateTime: string | Date): string {
    if (typeof dateTime === 'string') {
      dateTime = new Date(dateTime);
    }
    const year = dateTime.getFullYear();
    const month = `${dateTime.getMonth() + 1}`.padStart(2, '0');
    const day = `${dateTime.getDate()}`.padStart(2, '0');
    const hours = `${dateTime.getHours()}`.padStart(2, '0');
    const minutes = `${dateTime.getMinutes()}`.padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadDelegations(): void {
    this.delegationsService.getDelegations().subscribe({
      next: (data) => {
        this.delegations = data;

        // If in edit mode, set the initial value for the delegation
        if (this.isEditMode && this.tasksForm.value.delegationId) {
          const delegation = this.delegations.find(d => d.id === this.tasksForm.value.delegationId);
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

  onUpdate(): void {
    if (this.tasksForm.invalid) return;

    const id = this.activeRoute.snapshot.params['id'];
    const task = this.transforData(this.tasksForm.value);
    this.taskService.updateTask(id, task).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/tasks']);
        Swal.fire({
          title: 'Tarea actualizada',
          text: 'Tarea actualizada correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error actualizando la tarea:', err);
      },
    });
  }

  onCreate(): void {
    if (this.tasksForm.invalid) return;

    const task = this.transforData(this.tasksForm.value);
    this.taskService.addTask(task).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/tasks']);
        Swal.fire({
          title: 'Tarea creada',
          text: 'Tarea creada correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error('Error creando la tarea:', err);
      },
    });
  }
}
