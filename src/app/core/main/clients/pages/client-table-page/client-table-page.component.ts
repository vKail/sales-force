import { Component, OnInit, inject } from '@angular/core';
import { ClientService } from '../../clients.service';
import { IClient } from '../../interfaces/client.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-table-page',
  standalone: true,
  imports: [MatIcon,RouterLink, CommonModule],
  templateUrl: './client-table-page.component.html',
  styles: ``,
})
export class ClientTablePageComponent implements OnInit{
    clientService = inject(ClientService);
    clients: IClient[] = []; 
    allClients: IClient[] = [];
    currentPage = 1;
    pageSize = 5;
    userRole: string | null = "";

    
    constructor(private authService: AuthService) { }
  
    ngOnInit(): void {
      this.loadClients();
      this.userRole = this.authService.getUserRole();
    }

    loadClients(): void {
      this.clientService.getClients().subscribe((clients) => {
        this.allClients = clients;
        this.applyPagination();
      });
    }

    applyPagination(): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.clients = this.allClients.slice(startIndex, startIndex + this.pageSize);
    }

    get totalPages(): number[] {
      const totalClients = this.allClients.length;
      const pages = Math.ceil(totalClients / this.pageSize);
      return Array.from({ length: pages }, (_, index) => index + 1);
    }

    onPageChange(page: number): void {
      this.currentPage = page;
      this.applyPagination();
    }

    @needConfirmation({
      title: 'Eliminar Cliente',
      message: '¿Estás seguro de eliminar este usuario?',
    
    })
    deleteClient(id: number): void {
      this.clientService.deleteClient(id).subscribe(() => {
        this.allClients = this.allClients.filter((client) => client.id !== id);
        this.applyPagination();
      });
    }
  

}
