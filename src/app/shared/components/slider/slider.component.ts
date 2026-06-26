import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent implements OnInit {
  responsiveOptions: any[] = [];

  popularCourses: Array<{
    id: string;
    title: string;
    description?: string;
    image: string;
    rating?: number;
    students?: number;
    popularScore?: number;
  }> = [];

  constructor(private readonly api: ApiService) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 4,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '576px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    // Popular courses section removed because backend /api/courses/popular endpoint removed.
    this.popularCourses = [
      
        {
          "id": "1",
          "title": "Angular 21 Masterclass",
          "description": "Complete Angular Development Course",
          "image": "https://picsum.photos/400/250?random=1",
          "rating": 4.9,
          "students": 1200,
          "popularScore": 95
        },
        {
          "id": "2",
          "title": "RxJS Deep Dive",
          "description": "Reactive Programming with RxJS",
          "image": "https://picsum.photos/400/250?random=2",
          "rating": 4.8,
          "students": 980,
          "popularScore": 88
        },
        {
          "id": "3",
          "title": "NgRx Complete Guide",
          "description": "State Management in Angular",
          "image": "https://picsum.photos/400/250?random=3",
          "rating": 4.7,
          "students": 850,
          "popularScore": 92
        },
        {
          "id": "4",
          "title": "TypeScript Pro",
          "description": "Advanced TypeScript Concepts",
          "image": "https://picsum.photos/400/250?random=4",
          "rating": 4.9,
          "students": 1500,
          "popularScore": 99
        },
        {
          "id": "5",
          "title": "Node.js API Development",
          "description": "Build REST APIs with Express",
          "image": "https://picsum.photos/400/250?random=5",
          "rating": 4.6,
          "students": 760,
          "popularScore": 81
        },
        {
          "id": "6",
          "title": "MongoDB Essentials",
          "description": "Database Design and Queries",
          "image": "https://picsum.photos/400/250?random=6",
          "rating": 4.8,
          "students": 1100,
          "popularScore": 91
        },
        {
          "id": "7",
          "title": "JavaScript Interview Prep",
          "description": "Top JS Interview Questions",
          "image": "https://picsum.photos/400/250?random=7",
          "rating": 4.9,
          "students": 1800,
          "popularScore": 97
        },
        {
          "id": "8",
          "title": "HTML & CSS Advanced",
          "description": "Responsive UI Development",
          "image": "https://picsum.photos/400/250?random=8",
          "rating": 4.5,
          "students": 650,
          "popularScore": 78
        },
        {
          "id": "9",
          "title": "Full Stack Web Development",
          "description": "Frontend + Backend Complete Guide",
          "image": "https://picsum.photos/400/250?random=9",
          "rating": 4.8,
          "students": 1400,
          "popularScore": 90
        },
        {
          "id": "10",
          "title": "Angular Enterprise Architecture",
          "description": "Large Scale Angular Applications",
          "image": "https://picsum.photos/400/250?random=10",
          "rating": 5.0,
          "students": 2100,
          "popularScore": 100
        }
    ];

  }
}

