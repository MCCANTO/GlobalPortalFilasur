import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-approbal-confirm-user',
  templateUrl: './dialog-approbal-confirm-user.component.html',
  styleUrls: ['./dialog-approbal-confirm-user.component.css']
})
export class DialogApprobalConfirmUserComponent {
  constructor(public dialogRef: MatDialogRef<DialogApprobalConfirmUserComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
