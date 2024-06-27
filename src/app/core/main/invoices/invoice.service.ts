import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, map } from 'rxjs';
import { Invoice, Item } from './interfaces/invoice-bh.interface';
import { InvoiceResponseInterface } from './interfaces/invoice.interface';
import { TotalResponseInterface } from './interfaces/total-response.interface';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/api/v1/transaction';
  private invoiceSubject = new BehaviorSubject<Invoice>({
    type: '',
    paymentMethodId: 0,
    items: [],
    delegationId: 0,
    date: new Date(),
  });

  public getInvoices(): Observable<InvoiceResponseInterface[]> {
    return this.http.get<InvoiceResponseInterface[]>(this.url);
  }

  public createInvoice(invoice: Invoice): Observable<InvoiceResponseInterface> {
    return this.http.post<InvoiceResponseInterface>(this.url, invoice);
  }

  public calculateValues(): Observable<TotalResponseInterface> {
    const currentInvoice = this.invoiceSubject.getValue();
    return this.http
      .post<TotalResponseInterface>(`${this.url}/calculate`, currentInvoice)
      .pipe(
        map((response) => {
          return this.transformValues(response);
        })
      );
  }

  public sendInvoice(invoice: Invoice): Observable<InvoiceResponseInterface> {
    return this.http.post<InvoiceResponseInterface>(
      `${this.url}/create_autorize`,
      invoice
    );
  }

  public getInvoice(): Observable<Invoice> {
    return this.invoiceSubject.asObservable();
  }

  public updateInvoice(invoice: Invoice): void {
    this.invoiceSubject.next(invoice);
  }

  public updateType(type: string): void {
    const currentInvoice = this.invoiceSubject.getValue();
    this.invoiceSubject.next({ ...currentInvoice, type });
  }

  public updateItems(items: Item[]): void {
    const currentInvoice = this.invoiceSubject.getValue();
    this.invoiceSubject.next({ ...currentInvoice, items });
  }

  public updateDelegate(delegationId: number): void {
    const currentInvoice = this.invoiceSubject.getValue();
    this.invoiceSubject.next({ ...currentInvoice, delegationId });
  }

  public updatePaymentMethod(paymentMethodId: number): void {
    const currentInvoice = this.invoiceSubject.getValue();
    this.invoiceSubject.next({ ...currentInvoice, paymentMethodId });
  }

  private transformValues(
    value: TotalResponseInterface
  ): TotalResponseInterface {
    return {
      totalSinImpuestos: value.totalSinImpuestos,
      totalDescuento: value.totalDescuento,
      propina: value.propina,
      importeTotal: value.importeTotal,
    };
  }
}
