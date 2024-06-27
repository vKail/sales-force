import { Component, input } from '@angular/core';
import { TotalResponseInterface } from '../../interfaces/total-response.interface';

@Component({
  selector: 'app-calculate-values',
  standalone: true,
  imports: [],
  templateUrl: './calculate-values.component.html',
  styles: ``,
})
export class CalculateValuesComponent {
  values = input<TotalResponseInterface>();
}
