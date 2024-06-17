import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ILogin } from '../../core/auth/interfaces/ILogin.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './nav-bar.component.html',
  styles: ``,
})
export class NavBarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);


  logout() {
    this.authService.signout()
  }
}
