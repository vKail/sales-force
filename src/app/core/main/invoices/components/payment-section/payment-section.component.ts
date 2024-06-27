import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ClientFormComponent } from '../../../clients/components/client-form/client-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PaymentService } from '../../../payments/payments.service';
import { Payment } from '../../../payments/interfaces/payment.interface';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-payment-section',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    ClientFormComponent,
    MatDialogModule,
  ],
  templateUrl: './payment-section.component.html',
  styles: ``,
})
export class PaymentSectionComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private invoiceService = inject(InvoiceService);
  payments: Payment[] = [];

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe((payments) => {
      this.payments = payments;
    });
  }

  onPaymentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedPayment = +target.value;
    this.invoiceService.updatePaymentMethod(selectedPayment);
  }
}
