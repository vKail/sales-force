import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUrl = 'http://localhost:3000/api/v1/auth';
    private http = inject(HttpClient);
    private router = inject(Router);

    constructor(){}

    signin(username: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/signin`, { username, password }, { withCredentials: true })
          .pipe(
            tap(() => {
              // Maneja las cookies automáticamente con { withCredentials: true }
            })
          );
      }
    
      signout(): void {
        this.http.get(`${this.baseUrl}/signout`, { withCredentials: true }).subscribe(() => {
          // Redirige a la página de inicio de sesión o página principal
          this.router.navigate(['/auth/login']);
        });
      }
    
      isAuthenticated(): boolean {
        return !!document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
      }
    }