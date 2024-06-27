import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InvoiceResponseInterface } from '../../interfaces/invoice.interface';

@Component({
  selector: 'app-invoice-table',
  standalone: true,
  imports: [RouterLink, MatIconModule, DatePipe, CurrencyPipe],
  templateUrl: './invoice-table.component.html',
  styles: ``,
})
export class InvoiceTableComponent {
  invoices = input.required<InvoiceResponseInterface[]>();
}
