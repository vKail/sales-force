import { Component } from '@angular/core';
import { TasksFormComponent } from '../../components/tasks-form/tasks-form.component';

@Component({
  selector: 'app-tasks-form-page',
  standalone: true,
  imports: [TasksFormComponent],
  templateUrl: './tasks-form-page.component.html',
  styles: ``,
})
export class TasksFormPageComponent {

}
