import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  successMessage(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
  failedMessage(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
