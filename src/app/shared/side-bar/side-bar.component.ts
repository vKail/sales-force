import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IModule } from '../module/interface/module.interface';
import { IPermission } from '../permission/interface/permission.interface';
import { SideBarService } from './side-bar.service';
import { CommonModule } from '@angular/common';
import { MODULES_SUBMODULES, SubModule } from '../permission/submodules/submodules.config';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatIconModule, RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styles: ``,
})
export class SideBarComponent implements OnInit {
  subModules: SubModule[] = [];
  permissions: IPermission[] = [];
  modules: IModule[] = [];
  employeeId: number | null = null;

  constructor(private sideBarService: SideBarService, private authService: AuthService) {}

  ngOnInit(): void {
    this.employeeId = this.authService.getUserId();
    if (this.employeeId !== null) {
      this.loadPermissionsAndModules(this.employeeId);
    }
  }

  loadPermissionsAndModules(employeeId: number): void {
    this.sideBarService.getPermissions().subscribe(permissions => {
      this.sideBarService.getModules().subscribe(modules => {
        this.permissions = permissions.filter(permission => permission.employeeId === employeeId);
        this.modules = modules;
        this.subModules = this.getAllowedSubModules();
      });
    });
  }

  getAllowedSubModules(): SubModule[] {
    let allowedSubModules: SubModule[] = [];
    this.permissions.forEach(permission => {
      let moduleSubModules = MODULES_SUBMODULES.find(ms => ms.moduleId === permission.moduleId);
      if (moduleSubModules) {
        allowedSubModules = [...allowedSubModules, ...moduleSubModules.subModules];
      }
    });
    return allowedSubModules;
  }
}