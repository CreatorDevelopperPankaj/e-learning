import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// @Component({
//   selector: 'app-instructor-dashboard',
//   standalone: true,
//   imports:[],
//   template: '<h2>Instructor Dashboard works</h2>'
// })

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class InstructorDashboardComponent {}

