import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IProduct } from './interfaces/product-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly url = 'http://localhost:3000/api/v1/product';
  http = inject(HttpClient);
  router = inject(Router);
  constructor() {}
  public getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.url}`);
  }
  public getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${id}`);
  }
  public addProduct(quota: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.url}`, quota);
  }
  public updateProduct(
    id: number,
    updateData: Partial<IProduct>
  ): Observable<IProduct> {
    return this.http.patch<IProduct>(`${this.url}/${id}`, updateData);
  }
  public deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
