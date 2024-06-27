import { Component, OnInit, inject } from '@angular/core';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { IChance, IChanceGet } from '../../interfaces/opportunity.interface';
import { ChancesServices } from '../../opportunities.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-opportunities-table-pages',
  standalone: true,
  imports: [RouterLink,MatIcon, CommonModule, DatePipe],
  templateUrl: './opportunities-table-pages.component.html',
  styles:  ``,
})
export class OpportunitiesTablePagesComponent implements OnInit{
  chances : IChanceGet[] = [];
  allChances: IChanceGet[] = [];
  currentPage = 1;
  pageSize = 5;

  private chanceservice = inject(ChancesServices);

  ngOnInit(): void {
    this.loadChances();
  }

  loadChances(): void {
    this.chanceservice.getChances().subscribe((chances) => {
      this.allChances = chances;
      this.applyPagination();
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.chances = this.allChances.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    const totalChances = this.allChances.length;
    const pages = Math.ceil(totalChances / this.pageSize);
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  @needConfirmation({
    title: 'Eliminar Oportunidad',
    message: '¿Estás seguro de eliminar esta oportunidad de venta?',
  })
  deleteProduct(id: number): void { 
    this.chanceservice.deleteChance(id).subscribe(() => {
      this.allChances = this.allChances.filter((chance) => chance.id !== id);
      this.applyPagination();
    });
  }
}
