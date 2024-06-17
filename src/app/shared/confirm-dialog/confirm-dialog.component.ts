import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogData } from './interfaces/confirm-dialog-data.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styles: ``,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
