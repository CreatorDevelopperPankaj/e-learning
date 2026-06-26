import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PricingComponent } from '../pricing/pricing.component';
import { FaqComponent } from '../faq/faq.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ButtonModule,
    PricingComponent,
    FaqComponent,
    AboutComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Configuration structure to handle the slider content dynamically
  slides = [
    {
      title: 'Web design',
      highlight: 'course',
      description: 'Best web design courses and tutorials',
      image: 'assets/images/web-design-hero-illustration.png',

      link: '/courses/course-list'
    },
    {
      title: 'UI/UX Masterclass',
      highlight: 'track',
      description: 'Learn modern wireframing and prototyping architectures',
      image: 'assets/images/ui-ux-illustration.png', // Placeholder if you add more slides later

      link: '/courses/course-list'
    }
  ];

  // Tracking index state for the pagination dots
  currentSlideIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Logic for initializing page setup if needed
    console.log('HomeComponent initialized with slides:', this.slides);
  }

  // Active slide getters
  get currentSlide() {
    return this.slides[this.currentSlideIndex];
  }

  // Navigation commands for layout arrow buttons
  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
    } else {
      this.currentSlideIndex = 0; // Loops back to the start
    }
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    } else {
      this.currentSlideIndex = this.slides.length - 1; // Loops back to the end
    }
  }

  setSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}