import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IDelegationGet, IDelegations, IDelegationsPost } from "./interfaces/delegations.interface";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class DelegationsService {
    readonly url = 'http://localhost:3000/api/v1/delegation';
    http = inject(HttpClient);
    router = inject(Router);
    private invoiceSubject = new BehaviorSubject<IDelegationsPost>({
        employeeId: 0,
        consumerId: 0
      });
    
    constructor() {
    }
    public getDelegations(){
        return this.http.get<IDelegationGet[]>(`${this.url}`);
    }
    public getDelegationById(id : number) {
        return this.http.get<IDelegationGet>(`${this.url}/${id}`);
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
    public updateDelegationForEmployee(idEmployee: number){
        const currentDelegation = this.invoiceSubject.getValue();
        this.invoiceSubject.next({
            ...currentDelegation,
            employeeId: idEmployee,
        });
    }
    public updateDelegationForCustomer(idCustomer: number){
        const currentDelegation = this.invoiceSubject.getValue();
        this.invoiceSubject.next({
            ...currentDelegation,
            employeeId: idCustomer,
        });
    }
    
}