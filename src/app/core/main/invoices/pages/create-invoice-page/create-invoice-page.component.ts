import { Component, OnInit, inject } from '@angular/core';
import { ItemSectionComponent } from '../../components/item-section/item-section.component';
import { TypeSectionComponent } from '../../components/type-section/type-section.component';
import { Invoice } from '../../interfaces/invoice-bh.interface';
import { InvoiceService } from '../../invoice.service';
import { TotalResponseInterface } from '../../interfaces/total-response.interface';
import { PaymentSectionComponent } from '../../components/payment-section/payment-section.component';
import { DelegationComponent } from '../../components/delegation/delegation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-invoice-page',
  standalone: true,
  imports: [
    TypeSectionComponent,
    PaymentSectionComponent,
    DelegationComponent,
    ItemSectionComponent,
  ],
  templateUrl: './create-invoice-page.component.html',
  styles: ``,
})
export class CreateInvoicePageComponent implements OnInit {
  invoice: Invoice | null = null;
  total!: TotalResponseInterface;

  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  ngOnInit(): void {
    this.invoiceService.getInvoice().subscribe((invoice) => {
      this.invoice = invoice;
    });
  }

  sendData(): void {
    if (this.invoice) {
      this.invoiceService.createInvoice(this.invoice).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard/invoices']);
        },
        error: (error) => {
          console.error('Error', error);
        },
      });
    }
  }

  onTotalChanged(newTotal: TotalResponseInterface): void {
    this.total = newTotal;
  }
}
