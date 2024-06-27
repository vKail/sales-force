import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Payment } from './interfaces/payment.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  readonly url = 'http://localhost:3000/api/v1/payment-method';
  http = inject(HttpClient);
  router = inject(Router);

  public getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.url);
  }
}
