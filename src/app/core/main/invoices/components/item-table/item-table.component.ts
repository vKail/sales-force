import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IProduct } from '../../../products/interfaces/product-interface';
import { CurrencyPipe } from '@angular/common';
import { ItemResponse } from '../../interfaces/item-response.interface';
import { Item } from '../../interfaces/invoice-bh.interface';
import { TotalResponseInterface } from '../../interfaces/total-response.interface';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-item-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
  ],
  templateUrl: './item-table.component.html',
  styles: ``,
})
export class ItemTableComponent {
  displayedColumns: string[] = [
    'code',
    'description',
    'precio',
    'quantity',
    'discount',
    'actions',
  ];

  dataSource: ItemResponse[] = [];
  @Output() itemsChange = new EventEmitter<Item[]>();
  totalChanged = signal<TotalResponseInterface>({
    totalSinImpuestos: 0,
    totalDescuento: 0,
    propina: 0,
    importeTotal: 0,
  });
  private invoiceService = inject(InvoiceService);

  public addItem(product: IProduct) {
    const newItem: ItemResponse = {
      id: this.dataSource.length + 1,
      cantidad: 1,
      descuento: 0,
      product: product,
    };
    this.dataSource.push(newItem);
    this.dataSource = [...this.dataSource];
    this.itemsChange.emit(this.transformedDataSource());
    this.recalculateTotals();
  }

  saveItem(item: ItemResponse) {
    const index = this.dataSource.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.dataSource[index] = item;
      this.dataSource = [...this.dataSource];
      this.itemsChange.emit(this.transformedDataSource());
      this.recalculateTotals();
    }
  }

  deleteItem(item: ItemResponse) {
    const index = this.dataSource.findIndex((i) => i.id === item.id);
    if (
      item.cantidad &&
      item.descuento !== null &&
      item.descuento !== undefined
    ) {
      this.dataSource.splice(index, 1);
      this.dataSource = [...this.dataSource];
      this.itemsChange.emit(this.transformedDataSource());
      this.recalculateTotals();
    }
  }

  onQuantityChange(item: ItemResponse): void {
    if (item.cantidad > 0) {
      this.saveItem(item);
    }
  }

  onDiscountChange(item: ItemResponse): void {
    if (item.descuento > 0) {
      this.saveItem(item);
    }
  }

  private recalculateTotals(): void {
    this.invoiceService.calculateValues().subscribe((response) => {
      this.totalChanged.set(response);
    });
  }

  private transformedDataSource(): Item[] {
    return this.dataSource.map((item) => ({
      discount: item.descuento,
      quantity: item.cantidad,
      productId: item.product.id,
    }));
  }
}
