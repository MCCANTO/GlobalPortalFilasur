import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavClosedComponent } from './shared/side-nav-left/side-nav-closed/side-nav-closed.component';
import { SideNavComponent } from './shared/side-nav-left/side-nav/side-nav.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { StatComponent } from './shared/stat/stat.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa esto
import { MatMenuModule } from '@angular/material/menu';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    SideNavClosedComponent,
    SideNavComponent,
    TopNavComponent,
    StatComponent,
    DashboardComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule, 
    NgxSpinnerModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
