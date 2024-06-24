import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ICategories } from "./interfaces/categories.interface";


@Injectable({
    providedIn: 'root'
})
export class QuotasService {
    readonly url = 'http://localhost:3000/api/v1/category';
    http = inject(HttpClient);
    router = inject(Router);
    constructor() {
    }
    public getCategories(): Observable<ICategories[]>{
        return this.http.get<ICategories[]>(`${this.url}`);
    }
    public getCategoryById(id : number): Observable<ICategories> {
        return this.http.get<ICategories>(`${this.url}/${id}`);
    }
    public addCategory(quota: ICategories): Observable<ICategories> {
        return this.http.post<ICategories>(`${this.url}`, quota);
    }
    public updateCategory(id: number, updateData: Partial<ICategories>): Observable<ICategories> {
        return this.http.patch<ICategories>(`${this.url}/${id}`, updateData);
      }
    public deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}