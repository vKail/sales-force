import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { inject } from "@angular/core";


export const authGuard : CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.isAuthenticated() ? true : router.navigate(['/auth/login']);
}