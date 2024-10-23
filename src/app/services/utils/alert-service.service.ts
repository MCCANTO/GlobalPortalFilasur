import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, take } from 'rxjs';
import { AlertBoxComponent } from 'src/app/recursos-humanos/components/alert-box/alert-box.component';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  dialogRef!: MatDialogRef<AlertBoxComponent>;

  constructor(
    private dialog: MatDialog,
    private _snackBar : MatSnackBar
  ) { }

  public open(options: any) {
    this.dialogRef = this.dialog.open(AlertBoxComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      },
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  snackBar(message:string, ok:string, position?:string, duration?:number) {
    this._snackBar.open(message, ok, {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 3000
    })
  }
}
