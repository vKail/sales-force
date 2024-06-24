import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserServices } from '../../users.service';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';

@Component({
  selector: 'app-user-table-page',
  standalone: true,
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './user-table-page.component.html',
  styles: ``,
})
export class UserTablePageComponent implements OnInit {
  userService = inject(UserServices);
  users: IUser[] = [];
  allUsers: IUser[] = []; // To store all users fetched from the service
  currentPage = 1;
  pageSize = 5;

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.allUsers = users; // Store all users
      this.applyPagination(); // Apply pagination to the initial load
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.users = this.allUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    const totalUsers = this.allUsers.length;
    const pages = Math.ceil(totalUsers / this.pageSize);
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  @needConfirmation({ 
    title: 'Eliminar usuario',
    message: '¿Estás seguro de eliminar este usuario?',
  })
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.allUsers = this.allUsers.filter((user) => user.id !== id);
      this.applyPagination();
    });
  }
}
