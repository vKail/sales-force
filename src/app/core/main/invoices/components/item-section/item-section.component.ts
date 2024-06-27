import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';
import { ProductDropdownComponent } from '../product-dropdown/product-dropdown.component';
import { ItemTableComponent } from '../item-table/item-table.component';
import { IProduct } from '../../../products/interfaces/product-interface';
import { TotalResponseInterface } from '../../interfaces/total-response.interface';
import { InvoiceService } from '../../invoice.service';
import { Item } from '../../interfaces/invoice-bh.interface';

@Component({
  selector: 'app-item-section',
  standalone: true,
  imports: [ProductDropdownComponent, ItemTableComponent],
  templateUrl: './item-section.component.html',
  styles: ``,
})
export class ItemSectionComponent {
  @ViewChild('invoiceTable') invoiceTable!: ItemTableComponent;
  @Output() totalChanged = new EventEmitter<TotalResponseInterface>();
  private invoiceService = inject(InvoiceService);

  onProductSelected(product: IProduct) {
    this.invoiceTable.addItem(product);
  }

  onItemsChange(Iitems: Item[]): void {
    this.invoiceService.updateItems(Iitems);
  }

  signalTotalChanged = effect(() =>
    this.totalChanged.emit(this.invoiceTable.totalChanged())
  );
}
