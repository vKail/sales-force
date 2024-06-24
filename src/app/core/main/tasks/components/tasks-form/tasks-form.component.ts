import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksService } from '../../tasks.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-form',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
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

  constructor() {}

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();

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
