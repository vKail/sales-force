import { Component, input, output } from '@angular/core';
import { IProduct } from '../../interfaces/product-interface';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './product-card-page.component.html',
  styles: ``,
})
export class ProductCardPageComponent {
   product = input.required<IProduct>();
  deleteProduct = output<number>();

  onDeleteProduct(id: number): void { 
    this.deleteProduct.emit(id);
  }
}


