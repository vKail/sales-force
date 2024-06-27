import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IClient } from './interfaces/client.interface';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  readonly url = 'http://localhost:3000/api/v1/person';

  http = inject(HttpClient);
  constructor() {}
  public getClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(`${this.url}/consumer`);
  }
  getClientById(id: number): Observable<IClient> {
    return this.http.get<IClient>(`${this.url}/consumer/${id}`);
  }
  addClient(client: IClient): Observable<IClient> {
    return this.http.post<IClient>(`${this.url}/createConsumer`, client);
  }
  updateClient(id: number, client: IClient): Observable<IClient> {
    return this.http.patch<IClient>(`${this.url}/consumer/${id}`, client);
  }
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
