import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { QuotasService } from '../../quotas.service';
import { IQuota } from '../../interfaces/quota.interface';
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
  quotas: IQuota[] = []; 
  
  constructor() { }

  ngOnInit(): void {
    this.quotaService.getQuotas().subscribe((quotas) => {
      this.quotas = quotas;
    });
  }

  @needConfirmation({
    title: 'Eliminar Cliente',
    message: '¿Estás seguro de eliminar este usuario?',
  
  })
  deleteClient(id: number): void {
    this.quotaService.deleteQuota(id).subscribe(() => {
      this.quotas = this.quotas.filter((quota) => quota.id !== id);
    });
  }

  updateStatus(id: number, status: string): void {
    const update = { achieved: status };
    this.quotaService.updateQuota(id, update).subscribe({
      next: () => {
        const quota = this.quotas.find((quota) => quota.id === id);
        if (quota) {
          quota.achieved = status;
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
