import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IDelegationGet } from '../../../delegations/interfaces/delegations.interface';
import { Observable, map, startWith } from 'rxjs';
import { DelegationsService } from '../../../delegations/delegations.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-delegation',
  standalone: true,
  imports: [ReactiveFormsModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './delegation.component.html',
  styles: ``,
})
export class DelegationComponent implements OnInit {
  private delegationsService = inject(DelegationsService);
  private invoiceService = inject(InvoiceService);
  searchInputForDelegation = new FormControl<string | IDelegationGet>('');
  filteredDelegations!: Observable<IDelegationGet[]>;
  delegations: IDelegationGet[] = [];

  ngOnInit(): void {
    this.filteredDelegations = this.searchInputForDelegation.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string'
          ? value
          : this.displayDelegation(value as IDelegationGet)
      ),
      map((name) => (name ? this._filter(name) : this.delegations.slice()))
    );

    this.loadDelegations();
  }

  loadDelegations(): void {
    this.delegationsService.getDelegations().subscribe((delegations) => {
      this.delegations = delegations;
    });
  }

  displayDelegation(delegation: IDelegationGet): string {
    return delegation
      ? `${delegation.employee.person.dni} - ${delegation.employee.person.firstName} ${delegation.employee.person.lastName} / ${delegation.consumer.person.dni} - ${delegation.consumer.person.firstName} ${delegation.consumer.person.lastName}`
      : '';
  }

  onDelegationSelected(event: any): void {
    const delegation = event.option.value as IDelegationGet;
    console.log(delegation.id);
    this.invoiceService.updateDelegate(delegation.id);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.delegations.filter(
      (delegation) =>
        delegation.employee.person.dni.toLowerCase().includes(filterValue) ||
        delegation.employee.person.firstName
          .toLowerCase()
          .includes(filterValue) ||
        delegation.employee.person.lastName
          .toLowerCase()
          .includes(filterValue) ||
        delegation.consumer.person.dni.toLowerCase().includes(filterValue) ||
        delegation.consumer.person.firstName
          .toLowerCase()
          .includes(filterValue) ||
        delegation.consumer.person.lastName.toLowerCase().includes(filterValue)
    );
  }
}
