import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styles: ``,
})
export class SideBarComponent {}
