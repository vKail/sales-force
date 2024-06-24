import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  IProduct } from '../../interfaces/product-interface';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { ProductsService } from '../../products.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    CommonModule,],
  templateUrl: './product-form.component.html',
  styles: ``,
})
export class ProductFormComponent implements OnInit{
  private activeRoute = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);

  productForm!: FormGroup;
  isEditMode: boolean = false;

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('edit');
    this.initForm();
  
    if (this.isEditMode) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.retrieveProduct(id);
      });
    }
  }
  

  initForm(): void {
    this.productForm = this.formBuilder.group({
      name: [
        '',
        Validators.required,
      ],
      brand: [
        '',
        Validators.required,
      ],
      stock: [
        '',
        Validators.required,
      ],
      price: [
        '',
        Validators.required,
      ],
      description: [
        '',
        Validators.required,
      ],
      category: [
        '',
        Validators.required,
      ],
    });
  }

  private retrieveProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Asegurarte de que el valor de codigoTarifa se selecciona correctamente
        const productData = {
          ...product,
          
        };
        this.productForm.patchValue(productData);
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se puede obtener el producto',
          icon: 'error',
        });
        this.router.navigate(['/dashboard/products']);
      },
    });
  }
  
  
  

  onUpdate(): void {
    const id = this.activeRoute.snapshot.params['id'];
    const product = this.productForm.value;
    // Aquí podrías asegurarte de enviar solo el id de la tarifa de impuestos
     // Convertir a string si es necesario
    console.log('Product:', product); 
    this.productService.updateProduct(id, product).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/products']);
        Swal.fire({
          title: 'Producto actualizado',
          text: 'Producto actualizado correctamente',
          icon: 'success',
        });
      },
    });
  }
  

  onCreate(): void {
    if (this.productForm.invalid) return;
    const product = this.productForm.value;
    console.log('Product:', product); 
    this.productService.addProduct(product).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/products']);
        Swal.fire({
          title: 'Producto creado',
          text: 'Producto creado correctamente',
          icon: 'success',
        });
      },
    });
  }
}