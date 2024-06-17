import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  matDialog = inject(MatDialog);
  private static instance: ConfirmDialogService | null = null;

  constructor(private dialog: MatDialog) {
    ConfirmDialogService.instance = this;
  }

  public static getInstance() {
    return ConfirmDialogService.instance;
  }

  openDialog<T>(data: any, component: ComponentType<T>): Observable<boolean> {
    return this.matDialog
      .open(component, {
        data: data,
        disableClose: true,
      })
      .afterClosed();
  }
}
