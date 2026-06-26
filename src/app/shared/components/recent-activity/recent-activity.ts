import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './recent-activity.html',
  styleUrls: ['./recent-activity.scss']
})
export class RecentActivity {

  activities = [
    {
      title: 'Completed Lesson',
      subtitle: 'Angular Signals Deep Dive',
      time: '2h ago',
      color: 'purple',
      route: '/student/my-courses/angular-21-complete-guide/learn'
    },
    {
      title: 'Submitted Assignment',
      subtitle: 'Angular Project',
      time: '1 day ago',
      color: 'green',
      route: '/student/assignments'
    },
    {
      title: 'Earned Certificate',
      subtitle: 'RxJS Deep Dive',
      time: '3 days ago',
      color: 'orange',
      route: '/student/certificates'
    },
    {
      title: 'Enrolled in Course',
      subtitle: 'NgRx Complete Guide',
      time: '5 days ago',
      color: 'blue',
      route: '/student/my-courses/ngrx-complete-guide/details'
    }
  ];

}
