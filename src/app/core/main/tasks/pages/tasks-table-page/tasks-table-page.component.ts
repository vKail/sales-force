import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TasksService } from '../../tasks.service';
import { ITask } from '../../interfaces/task.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';

@Component({
  selector: 'app-tasks-table-page',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './tasks-table-page.component.html',
  styles: ``,
})
export class TasksTablePageComponent {
  taskService = inject(TasksService);
  tasks: ITask[] = []; 
  
  constructor() { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((task) => {
      this.tasks = task;
    });
  }

  @needConfirmation({
    title: 'Eliminar Tarea',
    message: '¿Estás seguro de eliminar esta tarea?',
  
  })
  deleteDelegation(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks= this.tasks.filter((client) => client.id !== id);
    });
  }


}