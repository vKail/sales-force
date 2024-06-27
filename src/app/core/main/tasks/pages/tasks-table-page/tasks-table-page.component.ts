import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TasksService } from '../../tasks.service';
import { ITask, ITaskGet } from '../../interfaces/task.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks-table-page',
  standalone: true,
  imports: [RouterLink, MatIcon, DatePipe, CommonModule],
  templateUrl: './tasks-table-page.component.html',
  styles: ``,
})
export class TasksTablePageComponent {
  taskService = inject(TasksService);
  tasks: ITaskGet[] = []; 
  allTasks: ITaskGet[] = [];
  currentPage = 1;
  pageSize = 5;
  
  constructor() { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.allTasks = tasks;
      this.applyPagination();
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.tasks = this.allTasks.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    const totalTasks = this.allTasks.length;
    const pages = Math.ceil(totalTasks / this.pageSize);
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  @needConfirmation({
    title: 'Eliminar Tarea',
    message: '¿Estás seguro de eliminar esta tarea?',
  
  })
  deleteDelegation(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.allTasks = this.allTasks.filter((task) => task.id !== id);
      this.applyPagination();
    });
  }


}