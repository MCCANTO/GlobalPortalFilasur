import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
// import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginComponent } from './login/login.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import { SnackbarComponent } from './snackbar/snackbar.component';


@NgModule({
  declarations: [
    LoginComponent,
    SnackbarComponent,
  ],
  imports: [
    CommonModule,
    // MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule, MatInputModule, MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, MatProgressBarModule,
    MatCardModule, MatMenuModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatSlideToggleModule, 
    // HttpClientModule,
    MatButtonModule, MatTabsModule, MatAutocompleteModule,
    MatTooltipModule, MatStepperModule, MatChipsModule,
    DragDropModule, MatExpansionModule
  ],
  exports: [
    // MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule, MatInputModule, MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, MatProgressBarModule,
    MatCardModule, MatMenuModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatSlideToggleModule, 
    // HttpClientModule,
    MatButtonModule, MatTabsModule, MatAutocompleteModule,
    MatTooltipModule, MatStepperModule, MatChipsModule,
    DragDropModule, MatExpansionModule
  ]
})
export class SharedModule { }
