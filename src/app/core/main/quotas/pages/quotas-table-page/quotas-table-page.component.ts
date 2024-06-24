import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { QuotasService } from '../../quotas.service';
import { IQuota, IQuotaGet } from '../../interfaces/quota.interface';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quotas-table-page',
  standalone: true,
  imports: [CommonModule,MatIcon,RouterLink,MatMenuTrigger,MatMenu],
  templateUrl: './quotas-table-page.component.html',
  styles: ``,
})
export class QuotasTablePageComponent implements OnInit{
  quotaService = inject(QuotasService);
  quotas: IQuotaGet[] = []; 
  allQuotas: IQuotaGet[] = [];
  currentPage = 1;
  pageSize = 5;
  
  constructor() { }

  ngOnInit(): void {
    this.loadQuotas();
  }

  loadQuotas(): void {
    this.quotaService.getQuotas().subscribe((quotas) => {
      this.allQuotas = quotas;
      this.applyPagination();
    }
    );
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.quotas = this.allQuotas.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    const totalQuotas = this.allQuotas.length;
    const pages = Math.ceil(totalQuotas / this.pageSize);
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }



  @needConfirmation({
    title: 'Eliminar Cliente',
    message: '¿Estás seguro de eliminar este usuario?',
  
  })
  deleteClient(id: number): void {
    this.quotaService.deleteQuota(id).subscribe(() => {
      this.allQuotas = this.allQuotas.filter((quota) => quota.id !== id);
    });
  }

  updateStatus(id: number, status: string): void {
    const update = { achieved: status };
    this.quotaService.updateQuota(id, update).subscribe({
      next: () => {
        const quota = this.allQuotas.find((quota) => quota.id === id);
        if (quota) {
          quota.achieved = status;
          this.applyPagination();
        }
        Swal.fire({
          title: 'Estado actualizado',
          text: `Estado de la cuota actualizado a ${status}`,
          icon: 'success',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado de la cuota',
          icon: 'error',
        });
      },
    });
  }
}