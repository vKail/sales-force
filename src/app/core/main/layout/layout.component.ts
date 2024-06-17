import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../../shared/side-bar/side-bar.component';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent, NavBarComponent],
  templateUrl: './layout.component.html',
  styles: ``
})
export class LayoutComponent {

}
