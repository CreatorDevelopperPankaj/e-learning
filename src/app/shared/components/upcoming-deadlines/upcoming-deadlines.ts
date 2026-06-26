import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upcoming-deadlines',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './upcoming-deadlines.html',
  styleUrls: ['./upcoming-deadlines.scss']
})
export class UpcomingDeadlines {

  deadlines = [
    {
      title: 'Angular Project',
      subtitle: 'Submit your project',
      status: 'Tomorrow',
      class: 'danger',
      route: '/student/assignments'
    },
    {
      title: 'RxJS Quiz',
      subtitle: 'Chapter 5 to 7',
      status: 'In 2 Days',
      class: 'warning',
      route: '/student/assignments'
    },
    {
      title: 'NgRx Assessment',
      subtitle: 'Modules 1 to 6',
      status: 'In 5 Days',
      class: 'success',
      route: '/student/assignments'
    }
  ];

}
