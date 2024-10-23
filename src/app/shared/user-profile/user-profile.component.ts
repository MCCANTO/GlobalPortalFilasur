import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  @Input() user: any;
  @Output() profileClick = new EventEmitter<void>();
  @Output() ChangePasswordClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  goToProfile() {
    this.profileClick.emit();
  }

  goToChangePassword() {
    this.ChangePasswordClick.emit();
  }

  logout() {
    this.logoutClick.emit();
  }
}
