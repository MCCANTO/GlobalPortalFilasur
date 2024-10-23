import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cancelText: string,
    confirmText: string,
    message: string,
    title: string
  }, private mdDialogRef: MatDialogRef<AlertBoxComponent>) { }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public cancel() {
    this.mdDialogRef.close(false);
  }

  public confirm() {
    this.mdDialogRef.close(true);
  }

}
