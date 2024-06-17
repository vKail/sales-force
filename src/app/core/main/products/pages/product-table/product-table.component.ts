import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces/product-interface';
import { ProductsService } from '../../products.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { needConfirmation } from '../../../../../shared/components/confirm-dialog/decorators/confirm-dialog.decorator';
import { ProductCardPageComponent } from '../../components/product-card-page/product-card-page.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ProductCardPageComponent, MatIcon], // Importa los módulos necesarios
  templateUrl: './product-table.component.html',
  styles: ``,
})
export class ProductTableComponent implements OnInit{
  products : IProduct[] = [];

  private productService = inject(ProductsService);

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products) => {
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
