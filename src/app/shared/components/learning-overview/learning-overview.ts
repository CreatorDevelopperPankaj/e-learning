import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-learning-overview',
  imports: [RouterModule],
  templateUrl: './learning-overview.html',
  styleUrl: './learning-overview.scss',
})
export class LearningOverview {

   stats = [
    {
      title: 'Courses Completed',
      value: 24,
      icon: 'pi pi-book',
      class: 'purple',
      route: '/student/my-courses'
    },
    {
      title: 'Certificates Earned',
      value: 22,
      icon: 'pi pi-verified',
      class: 'green',
      route: '/student/certificates'
    },
    {
      title: 'Learning Hours',
      value: 93,
      icon: 'pi pi-clock',
      class: 'orange',
      route: '/student/learning'
    },
    {
      title: 'Assignments Submitted',
      value: 37,
      icon: 'pi pi-file',
      class: 'blue',
      route: '/student/assignments'
    }
  ];
}
