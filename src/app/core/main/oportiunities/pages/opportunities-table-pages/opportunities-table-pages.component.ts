import { Component, OnInit, inject } from '@angular/core';
import { needConfirmation } from '../../../../../shared/confirm-dialog/decorators/confirm-dialog.decorator';
import { IChance } from '../../interfaces/opportunity.interface';
import { ChancesServices } from '../../opportunities.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-opportunities-table-pages',
  standalone: true,
  imports: [RouterLink,MatIcon],
  templateUrl: './opportunities-table-pages.component.html',
  styles:  ``,
})
export class OpportunitiesTablePagesComponent implements OnInit{
  chances : IChance[] = [];

  private chanceservice = inject(ChancesServices);

  ngOnInit(): void {
    this.chanceservice.getChances().subscribe((chances) => {
      this.chances = chances;
    });
  }

  @needConfirmation({
    title: 'Eliminar Oportunidad',
    message: '¿Estás seguro de eliminar esta oportunidad de venta?',
  })
  deleteProduct(id: number): void { 
    this.chanceservice.deleteChance(id).subscribe(() => {
        this.chances = this.chances.filter((chance) => chance.id !== id);
      },
    );
  }
}
