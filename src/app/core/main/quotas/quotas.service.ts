import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IQuota } from "./interfaces/quota.interface";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class QuotasService {
    readonly url = 'http://localhost:3000/api/v1/quota';
    http = inject(HttpClient);
    router = inject(Router);
    constructor() {
    }
    public getQuotas(): Observable<IQuota[]>{
        return this.http.get<IQuota[]>(`${this.url}`);
    }
    public getQuotaById(id : number): Observable<IQuota> {
        return this.http.get<IQuota>(`${this.url}/${id}`);
    }
    public addQuota(quota: IQuota): Observable<IQuota> {
        return this.http.post<IQuota>(`${this.url}`, quota);
    }
    public updateQuota(id: number, updateData: Partial<IQuota>): Observable<IQuota> {
        return this.http.patch<IQuota>(`${this.url}/${id}`, updateData);
      }
    public deleteQuota(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}