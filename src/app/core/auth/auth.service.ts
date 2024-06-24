import { HttpClient } from "@angular/common/http";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUrl = 'http://localhost:3000/api/v1/auth';
    private http = inject(HttpClient);
    private router = inject(Router);
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

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
        // Verifica si el código se está ejecutando en el navegador
        if (isPlatformBrowser(this.platformId)) {
          // Ahora es seguro acceder a document.cookie
          return !!this.document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
        }
        return false; // O un valor predeterminado adecuado para el servidor
      }
    }