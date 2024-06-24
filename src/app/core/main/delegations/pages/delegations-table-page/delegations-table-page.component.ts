import { Component, OnInit, inject } from '@angular/core';
import { DelegationsService } from '../../delegations.service';
import { IDelegations } from '../../interfaces/delegations.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-delegations-table-page',
  standalone: true,
  imports: [RouterLink,MatIcon],
  templateUrl: './delegations-table-page.component.html',
  styles: ``,
})
export class DelegationsTablePageComponent implements OnInit{
  delegationservice = inject(DelegationsService);
  delegations: IDelegations[] = []; 
  
  constructor() { }

  ngOnInit(): void {
    this.delegationservice.getDelegations().subscribe((delegations) => {
      this.delegations = delegations;
    });
  }

  @needConfirmation({
    title: 'Eliminar Cliente',
    message: '¿Estás seguro de eliminar este usuario?',
  
  })
  deleteDelegation(id: number): void {
    this.delegationservice.deleteDelegation(id).subscribe(() => {
      this.delegations = this.delegations.filter((client) => client.id !== id);
    });
  }


}
