import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-approbal-advanced-confirm-user',
  templateUrl: './dialog-approbal-advanced-confirm-user.component.html',
  styleUrls: ['./dialog-approbal-advanced-confirm-user.component.css']
})
export class DialogApprobalAdvancedConfirmUserComponent {
  constructor(public dialogRef: MatDialogRef<DialogApprobalAdvancedConfirmUserComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
