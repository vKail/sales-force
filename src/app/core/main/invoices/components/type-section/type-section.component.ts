import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../invoice.service';

interface TransactionType {
  name: string;
}

@Component({
  selector: 'app-type-section',
  standalone: true,
  imports: [],
  templateUrl: './type-section.component.html',
  styles: ``,
})
export class TypeSectionComponent {
  private invoiceService = inject(InvoiceService);
  transactions: TransactionType[] = [
    { name: 'Pedido de venta' },
    { name: 'Cotizacion' },
    { name: 'Venta' },
  ];

  constructor() {
    this.updateTypeBaseCase();
  }

  onTypeInvoiceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedType = target.value;
    this.invoiceService.updateType(selectedType);
  }

  private updateTypeBaseCase(): void {
    if (this.transactions.length > 0) {
      this.invoiceService.updateType(this.transactions[0].name);
    }
  }
}
