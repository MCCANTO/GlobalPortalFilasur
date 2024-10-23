import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-policy',
  templateUrl: './dialog-policy.component.html',
  styleUrls: ['./dialog-policy.component.css']
})
export class DialogPolicyComponent {

  constructor(private dialogRef: MatDialogRef<DialogPolicyComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
