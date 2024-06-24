import { Component, OnInit, inject } from '@angular/core';
import { IClient } from '../../../clients/interfaces/client.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserServices } from '../../users.service';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-table-page',
  standalone: true,
  imports: [MatIcon,RouterLink, CommonModule],
  templateUrl: './user-table-page.component.html',
  styles: ``,
})
export class UserTablePageComponent implements OnInit{
    userService = inject(UserServices);
    users: IUser[] = []; 
    currentPage = 1;
    pageSize = 5; 
    
    constructor() { }
  
    ngOnInit(): void {
      this.userService.getUsers().subscribe((users) => {
        this.users = users;
      });
    }

    loadUsers(): void {
      this.userService.getUsers().subscribe(users => {
        // Implementar la lógica de paginación
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.users = users.slice(startIndex, startIndex + this.pageSize);
      });
    }
  
    get totalPages(): number[] {
      const totalUsers = this.users.length;
      const pages = Math.ceil(totalUsers / this.pageSize);
      return Array.from({ length: pages }, (_, index) => index + 1);
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadUsers();
    }
    @needConfirmation({
      title: 'Eliminar usuario',
      message: '¿Estás seguro de eliminar este usuario?',
    
    })
    deleteUser(id: number): void {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter((user) => user.id !== id);
      });
    }
  

}
