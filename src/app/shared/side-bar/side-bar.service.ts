import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IModule } from '../module/interface/module.interface';
import { IPermission } from '../permission/interface/permission.interface';


@Injectable({
  providedIn: 'root'
})
export class SideBarService {
    http = inject(HttpClient);
    private readonly url = 'http://localhost:3000/api/v1';
  constructor() {}

  getModules(): Observable<IModule[]> {
    return this.http.get<IModule[]>(`${this.url}/module`); // Ajusta la URL según tu backend
  }

  getPermissions(): Observable<IPermission[]> {
    return this.http.get<IPermission[]>(`${this.url}/permission`); // Ajusta la URL según tu backend
  }
}