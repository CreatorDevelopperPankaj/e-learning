import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-certificates',
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatIcon],
  templateUrl: './my-certificates.html',
  styleUrl: './my-certificates.scss',
})
export class MyCertificates {

  @ViewChild('certificateSlider')
  certificateSlider!: ElementRef;

scrollLeft(): void {
  this.certificateSlider.nativeElement.scrollBy({
    left: -320,
    behavior: 'smooth'
  });
}

scrollRight(): void {
  this.certificateSlider.nativeElement.scrollBy({
    left: 320,
    behavior: 'smooth'
  });
}

  certificates = [
    {
      id: 'angular-masterclass',
      name: 'Angular',
      subtitle: 'Masterclass',
      image: 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif'
    },
    {
      id: 'rxjs-deep-dive',
      name: 'RxJS',
      subtitle: 'Deep Dive',
      image: 'https://rxjs.dev/assets/images/favicons/favicon-192x192.png'
    },
    {
      id: 'ngrx-state-management',
      name: 'NgRx',
      subtitle: 'State Management',
      image: 'https://raw.githubusercontent.com/ngrx/platform/main/projects/ngrx.io/src/assets/images/badge.svg'
    },
    {
      id: 'typescript-complete-guide',
      name: 'TypeScript',
      subtitle: 'Complete Guide',
      image: 'https://www.typescriptlang.org/icons/icon-512x512.png'
    },
    {
      id: 'nodejs-masterclass',
      name: 'Node.js',
      subtitle: 'Masterclass',
      image: 'https://nodejs.org/static/images/logo.svg'
    },
    {
      id: 'mongodb-crash-course',
      name: 'MongoDB',
      subtitle: 'Crash Course',
      image: 'https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png'
    }
  ];

}
