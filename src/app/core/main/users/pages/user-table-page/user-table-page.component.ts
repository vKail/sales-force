import { Component, OnInit, inject } from '@angular/core';
import { IClient } from '../../../clients/interfaces/client.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserServices } from '../../users.service';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-table-page',
  standalone: true,
  imports: [MatIcon,RouterLink],
  templateUrl: './user-table-page.component.html',
  styles: ``,
})
export class UserTablePageComponent implements OnInit{
    clientService = inject(UserServices);
    users: IUser[] = []; 
    
    constructor() { }
  
    ngOnInit(): void {
      this.clientService.getUsers().subscribe((users) => {
        this.users = users;
      });
    }

    @needConfirmation({
      title: 'Eliminar usuario',
      message: '¿Estás seguro de eliminar este usuario?',
    
    })
    deleteClient(id: number): void {
      this.clientService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter((user) => user.id !== id);
      });
    }
  

}
