import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IProduct } from '../../../products/interfaces/product-interface';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductsService } from '../../../products/products.service';

@Component({
  selector: 'app-product-dropdown',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
  ],
  templateUrl: './product-dropdown.component.html',
  styles: ``,
})
export class ProductDropdownComponent implements OnInit {
  @Output() productSelected = new EventEmitter<IProduct>();
  private productService = inject(ProductsService);
  productControl = new FormControl('');
  products: IProduct[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  filteredProducts: Observable<IProduct[]> =
    this.productControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

  private _filter(value: string): IProduct[] {
    const stringValue = typeof value === 'string' ? value : '';
    const filteredValue = stringValue.toLowerCase();

    return this.products.filter((product) =>
      product.name.toLowerCase().includes(filteredValue)
    );
  }

  onProductSelected(product: IProduct) {
    this.productSelected.emit(product);
  }

  displayFn(product: IProduct): string {
    return product && product.name
      ? product.name 
      : '';
  }
}
