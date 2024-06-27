import { Component, OnInit, inject } from '@angular/core';
import { DelegationsService } from '../../delegations.service';
import { IDelegationGet, IDelegations } from '../../interfaces/delegations.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delegations-table-page',
  standalone: true,
  imports: [RouterLink,MatIcon,CommonModule],
  templateUrl: './delegations-table-page.component.html',
  styles: ``,
})
export class DelegationsTablePageComponent implements OnInit{
  delegationservice = inject(DelegationsService);
  delegations: IDelegationGet[] = []; 
  allDelegations: IDelegationGet[] = [];
  currentPage = 1;
  pageSize = 5;
  userRole: string | null = "";
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadDelegations();
    this.userRole = this.authService.getUserRole();
  }

  loadDelegations(): void {
    this.delegationservice.getDelegations().subscribe((delegations) => {
      this.allDelegations = delegations;
      this.applyPagination();
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.delegations = this.allDelegations.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    const totalDelegations = this.allDelegations.length;
    const pages = Math.ceil(totalDelegations / this.pageSize);
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
  deleteDelegation(id: number): void {
    this.delegationservice.deleteDelegation(id).subscribe(() => {
      this.allDelegations = this.allDelegations.filter((delegation) => delegation.id !== id);
      this.applyPagination();
    });
  }


}
