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
  allProducts: IProduct[] = [];
  currentPage = 1;
  pageSize = 5;

  private productService = inject(ProductsService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.applyPagination();
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.products = this.allProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    const totalProducts = this.allProducts.length;
    const pages = Math.ceil(totalProducts / this.pageSize);
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  @needConfirmation({
    title: 'Eliminar Producto',
    message: '¿Estás seguro de eliminar este producto?',
  })
  deleteProduct(id: number): void { 
    this.productService.deleteProduct(id).subscribe(() => {
      this.allProducts = this.allProducts.filter((product) => product.id !== id);
      this.applyPagination();
    });
  }
}
