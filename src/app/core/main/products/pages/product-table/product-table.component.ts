import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces/product-interface';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIcon], // Importa los módulos necesarios
  templateUrl: './product-table.component.html',
  styles: ``,
})
export class ProductTableComponent implements OnInit{
  products : IProduct[] = [];

  private productService = inject(ProductsService);

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  @needConfirmation({
    title: 'Eliminar Producto',
    message: '¿Estás seguro de eliminar este producto?',
  })
  deleteProduct(id: number): void { 
    this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter((product) => product.id !== id);
      },
    );
  }
}
