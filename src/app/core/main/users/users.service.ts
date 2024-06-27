import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IClient } from "../clients/interfaces/client.interface";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { IUpdateUser, IUser } from "./interfaces/user.interface";


@Injectable({
    providedIn: 'root',
  })
export class UserServices {
    readonly url = 'http://localhost:3000/api/v1/person';
    http = inject(HttpClient);
    private router = inject(Router);
    constructor() {
    }
    public getUsers(): Observable<IUser[]>{
        return this.http.get<IUser[]>(`${this.url}/employee`);
    }
    getUserById(id : number): Observable<IUser> {
        return this.http.get<IUser>(`${this.url}/employee/${id}`);
    }
    addUser(user: IUser): Observable<IUser> {
        return this.http.post<IUser>(`${this.url}/createEmployee`, user);
    }
    updateUser(id: number, user: IUpdateUser): Observable<IUser>{
        return this.http.patch<IUser>(`http://localhost:3000/api/v1/employee/${id}`, user);
    }
    deleteUser(id: number): Observable<IUser> {
        return this.http.delete<IUser>(`${this.url}/${id}`);
    }
}