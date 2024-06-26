import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksService } from '../../tasks.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-tasks-form',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,],
  templateUrl: './tasks-form.component.html',
  styles: ``,
})
export class TasksFormComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private taskService = inject(TasksService);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);
  tasksForm!: FormGroup;
  isEditMode: boolean = false;
  minDate: string = ''; // Fecha mínima para date
  maxDate: string = ''; // Fecha máxima para date
  minDateTime: string = ''; // Fecha y hora mínima para estimatedTime
  maxDateTime: string = ''; // Fecha y hora máxima para estimatedTime 

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
          comments: task.comments[0].content,
        };
        this.tasksForm.patchValue(formattedtask);
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

  transforData(formValue: any): any {
    const dateWithTime = new Date(formValue.date).toISOString();
    const estimatedTimeWithTime = new Date(formValue.estimatedTime).toISOString();
    
    return {
      date: dateWithTime,
      estimatedTime: estimatedTimeWithTime,
      type: formValue.type,
      delegationId: formValue.delegationId,
      comments: [{
        content: formValue.content,
      }],
    };
  }

  setMinMaxDates(): void {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 30);

    this.minDate = currentDate.toISOString().substring(0, 10); // Fecha mínima para date
    this.maxDate = futureDate.toISOString().substring(0, 10); // Fecha máxima para date
    this.minDateTime = this.formatDateTime(currentDate); // Fecha y hora mínima para estimatedTime
    this.maxDateTime = this.formatDateTime(futureDate); // Fecha y hora máxima para estimatedTime
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
