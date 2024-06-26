import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { IChance, IChanceGet } from "./interfaces/opportunity.interface";


@Injectable({
    providedIn: 'root'
})
export class ChancesServices {
    readonly url = 'http://localhost:3000/api/v1/chance';
    http = inject(HttpClient);
    router = inject(Router);
    constructor() {
    }
    public getChances(): Observable<IChanceGet[]>{
        return this.http.get<IChanceGet[]>(`${this.url}`);
    }
    public getChanceById(id : number): Observable<IChance> {
        return this.http.get<IChance>(`${this.url}/${id}`);
    }
    public addChance(quota: IChance): Observable<IChance> {
        return this.http.post<IChance>(`${this.url}`, quota);
    }
    public updateChance(id: number, updateData: Partial<IChance>): Observable<IChance> {
        return this.http.patch<IChance>(`${this.url}/${id}`, updateData);
      }
    public deleteChance(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}