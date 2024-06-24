import { Component, OnInit, inject } from '@angular/core';
import { ClientService } from '../../clients.service';
import { IClient } from '../../interfaces/client.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-table-page',
  standalone: true,
  imports: [MatIcon,RouterLink],
  templateUrl: './client-table-page.component.html',
  styles: ``,
})
export class ClientTablePageComponent implements OnInit{
    clientService = inject(ClientService);
    clients: IClient[] = []; 
    
    constructor() { }
  
    ngOnInit(): void {
      this.clientService.getClients().subscribe((clients) => {
        this.clients = clients;
      });
    }

    @needConfirmation({
      title: 'Eliminar Cliente',
      message: '¿Estás seguro de eliminar este usuario?',
    
    })
    deleteClient(id: number): void {
      this.clientService.deleteClient(id).subscribe(() => {
        this.clients = this.clients.filter((client) => client.id !== id);
      });
    }
  

}
