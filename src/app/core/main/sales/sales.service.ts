import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IClient } from "../clients/interfaces/client.interface";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ITask, ITaskGet } from "./interfaces/sales.interface";


@Injectable({
    providedIn: 'root',
  })
export class TasksService {
    readonly url = 'http://localhost:3000/api/v1/task';
    http = inject(HttpClient);
    private router = inject(Router);
    constructor() {
    }
    public getTasks(): Observable<ITaskGet[]>{
        return this.http.get<ITaskGet[]>(`${this.url}`);
    }
    getTaskById(id : number): Observable<ITask> {
        return this.http.get<ITask>(`${this.url}/${id}`);
    }
    addTask(user: ITask): Observable<ITask> {
        return this.http.post<ITask>(`${this.url}`, user);
    }
    updateTask(id: number, user: ITask): Observable<ITask>{
        return this.http.put<ITask>(`${this.url}/change/${id}`, user);
    }
    deleteTask(id: number): Observable<ITask> {
        return this.http.delete<ITask>(`${this.url}/${id}`);
    }
}