import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IDelegationGet, IDelegations, IDelegationsPost } from "./interfaces/delegations.interface";


@Injectable({
    providedIn: 'root'
})
export class DelegationsService {
    readonly url = 'http://localhost:3000/api/v1/delegation';
    http = inject(HttpClient);
    router = inject(Router);
    constructor() {
    }
    public getDelegations(){
        return this.http.get<IDelegationGet[]>(`${this.url}`);
    }
    public getDelegationById(id : number) {
        return this.http.get<IDelegations>(`${this.url}/${id}`);
    }
    public addDelegation(delegation: IDelegationsPost) {
        return this.http.post<IDelegationsPost>(`${this.url}`, delegation);
    }
    public updateDelegation(id: number, delegation: IDelegationsPost){
        return this.http.patch<IDelegationsPost>(`${this.url}/${id}`, delegation);
    }
    public deleteDelegation(id: number) {
        return this.http.delete<IDelegations>(`${this.url}/${id}`);
    }
    
}