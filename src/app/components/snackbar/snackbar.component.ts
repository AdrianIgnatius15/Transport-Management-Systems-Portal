import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: false,
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  private _snackbar: MatSnackBar = inject(MatSnackBar);

  openSnackbar(message: string, action?: string) {
    this._snackbar.open(message, action);
  }
}
